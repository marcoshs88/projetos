#property copyright ""
#property link      ""
#property version   "1.00"
#property strict

#include <Trade/Trade.mqh>

// =============================
// Inputs
// =============================
input int    InpFastMAPeriod           = 12;            // Período MA rápida
input int    InpSlowMAPeriod           = 26;            // Período MA lenta
input ENUM_MA_METHOD InpMaMethod       = MODE_EMA;      // Método da média
input ENUM_APPLIED_PRICE InpPrice      = PRICE_CLOSE;   // Preço aplicado

input bool   InpUseRisk                = true;          // Usar risco por trade
input double InpRiskPerTradePercent    = 1.0;           // Risco por trade (%)
input double InpFixedLot               = 0.10;          // Lote fixo (fallback)

input int    InpStopLossPips           = 150;           // Stop Loss (pips)
input int    InpTakeProfitPips         = 300;           // Take Profit (pips)

input bool   InpUseTrailingStop        = true;          // Usar trailing stop
input int    InpTrailingStopPips       = 150;           // Trailing stop (pips)
input int    InpTrailingStepPips       = 15;            // Passo do trailing (pips)

input int    InpSlippagePoints         = 10;            // Desvio máximo (points)
input int    InpMagicNumber            = 20250915;      // MagicNumber

input bool   InpAllowLong              = true;          // Permitir compras
input bool   InpAllowShort             = true;          // Permitir vendas
input bool   InpOnePositionPerSymbol   = true;          // Apenas 1 posição por símbolo
input int    InpMaxSpreadPips          = 30;            // Spread máximo (pips, 0=desativado)

// Janela de negociação (HH:MM, horário do servidor). Vazio = sempre permitido
input string InpTradeStartTime         = "";            // Início (ex: 08:00)
input string InpTradeEndTime           = "";            // Fim (ex: 22:00)

// =============================
// Globals
// =============================
CTrade Trade;

int    points_per_pip = 10; // padrão para símbolos com 5/3 dígitos
double min_lot        = 0.01;
double lot_step       = 0.01;
double max_lot        = 100.0;
double tick_size      = 0.0;
double tick_value     = 0.0;

// =============================
// Helpers
// =============================
int PipsToPoints(const int pips)
{
    return pips * points_per_pip;
}

bool GetSymbolTradingProperties()
{
    if(!SymbolInfoInteger(_Symbol, SYMBOL_TRADE_MODE))
        return false;

    // Determinar relação point/pip
    if(_Digits == 3 || _Digits == 5)
        points_per_pip = 10;
    else
        points_per_pip = 1;

    // Propriedades de volume
    double volume_min = 0.0, volume_step_local = 0.0, volume_max = 0.0;
    if(!SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN, volume_min)) return false;
    if(!SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP, volume_step_local)) return false;
    if(!SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX, volume_max)) return false;
    min_lot  = volume_min;
    lot_step = volume_step_local;
    max_lot  = volume_max;

    // Tick properties
    if(!SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE, tick_size)) return false;
    if(!SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE, tick_value)) return false;
    return true;
}

double NormalizeLot(double lots)
{
    if(lots < min_lot)
        lots = min_lot;
    if(lots > max_lot)
        lots = max_lot;

    double steps = MathFloor((lots - min_lot) / lot_step + 0.5);
    double normalized = min_lot + steps * lot_step;
    return NormalizeDouble(normalized, 2);
}

double GetFreeMargin()
{
    return AccountInfoDouble(ACCOUNT_FREEMARGIN);
}

double GetPipValuePerLot()
{
    // Converte valor por tick para valor por pip
    // pip_value = tick_value * (points_per_pip / (tick_size/_Point))
    if(tick_size <= 0.0)
        return 0.0;
    double ticks_per_pip = (double)PipsToPoints(1) * _Point / tick_size;
    return tick_value * ticks_per_pip;
}

double CalculateLotSizeByRisk(const int stop_loss_pips)
{
    if(stop_loss_pips <= 0)
        return 0.0;

    double balance_or_margin = GetFreeMargin();
    double risk_money = balance_or_margin * (InpRiskPerTradePercent / 100.0);

    double pip_value_per_lot = GetPipValuePerLot();
    if(pip_value_per_lot <= 0.0)
        return 0.0;

    double stop_value_per_lot = pip_value_per_lot * (double)stop_loss_pips;
    if(stop_value_per_lot <= 0.0)
        return 0.0;

    double lots = risk_money / stop_value_per_lot;
    return NormalizeLot(lots);
}

double ResolveOrderLots(const int stop_loss_pips)
{
    if(InpUseRisk)
    {
        double risk_lots = CalculateLotSizeByRisk(stop_loss_pips);
        if(risk_lots >= min_lot)
            return risk_lots;
    }
    return NormalizeLot(InpFixedLot);
}

bool IsWithinTradingWindow()
{
    if(StringLen(InpTradeStartTime) == 0 || StringLen(InpTradeEndTime) == 0)
        return true;

    datetime now = TimeCurrent();
    int hour = TimeHour(now);
    int minute = TimeMinute(now);
    string current_str = StringFormat("%02d:%02d", hour, minute);

    // Parse start
    int sh=0, sm=0, eh=23, em=59;
    if(StringLen(InpTradeStartTime) >= 4)
    {
        sh = (int)StringToInteger(StringSubstr(InpTradeStartTime, 0, 2));
        sm = (int)StringToInteger(StringSubstr(InpTradeStartTime, 3, 2));
    }
    if(StringLen(InpTradeEndTime) >= 4)
    {
        eh = (int)StringToInteger(StringSubstr(InpTradeEndTime, 0, 2));
        em = (int)StringToInteger(StringSubstr(InpTradeEndTime, 3, 2));
    }

    int cur_minutes = hour * 60 + minute;
    int start_minutes = sh * 60 + sm;
    int end_minutes = eh * 60 + em;

    if(end_minutes >= start_minutes)
        return cur_minutes >= start_minutes && cur_minutes <= end_minutes;
    // janela atravessa meia-noite
    return (cur_minutes >= start_minutes) || (cur_minutes <= end_minutes);
}

bool SpreadFilterPassed()
{
    if(InpMaxSpreadPips <= 0)
        return true;
    MqlTick tick;
    if(!SymbolInfoTick(_Symbol, tick))
        return false;
    double spread_points = (tick.ask - tick.bid) / _Point;
    double spread_pips = spread_points / (double)points_per_pip;
    return spread_pips <= (double)InpMaxSpreadPips + 1e-6;
}

int GetOpenPositionsCountByMagic(const string symbol, const long magic)
{
    int total = PositionsTotal();
    int count = 0;
    for(int i=0; i<total; i++)
    {
        if(!PositionSelectByIndex(i))
            continue;
        if(PositionGetString(POSITION_SYMBOL) == symbol && PositionGetInteger(POSITION_MAGIC) == magic)
            count++;
    }
    return count;
}

int GetPositionTypeForSymbolMagic(const string symbol, const long magic)
{
    int total = PositionsTotal();
    for(int i=0; i<total; i++)
    {
        if(!PositionSelectByIndex(i))
            continue;
        if(PositionGetString(POSITION_SYMBOL) == symbol && PositionGetInteger(POSITION_MAGIC) == magic)
            return (int)PositionGetInteger(POSITION_TYPE); // POSITION_TYPE_BUY/SELL
    }
    return -1;
}

bool OpenBuy(const double lots, const int sl_pips, const int tp_pips)
{
    MqlTick tick;
    if(!SymbolInfoTick(_Symbol, tick))
        return false;

    double sl = 0.0, tp = 0.0;
    if(sl_pips > 0)
        sl = tick.bid - PipsToPoints(sl_pips) * _Point;
    if(tp_pips > 0)
        tp = tick.bid + PipsToPoints(tp_pips) * _Point;

    Trade.SetExpertMagicNumber(InpMagicNumber);
    Trade.SetDeviationInPoints(InpSlippagePoints);
    bool ok = Trade.Buy(lots, _Symbol, tick.ask, sl, tp, "MA Cross BUY");
    if(!ok)
        PrintFormat("Buy falhou: %s", _LastError);
    return ok;
}

bool OpenSell(const double lots, const int sl_pips, const int tp_pips)
{
    MqlTick tick;
    if(!SymbolInfoTick(_Symbol, tick))
        return false;

    double sl = 0.0, tp = 0.0;
    if(sl_pips > 0)
        sl = tick.ask + PipsToPoints(sl_pips) * _Point;
    if(tp_pips > 0)
        tp = tick.ask - PipsToPoints(tp_pips) * _Point;

    Trade.SetExpertMagicNumber(InpMagicNumber);
    Trade.SetDeviationInPoints(InpSlippagePoints);
    bool ok = Trade.Sell(lots, _Symbol, tick.bid, sl, tp, "MA Cross SELL");
    if(!ok)
        PrintFormat("Sell falhou: %s", _LastError);
    return ok;
}

void TrailOpenPosition()
{
    if(!InpUseTrailingStop || InpTrailingStopPips <= 0)
        return;

    if(!PositionSelect(_Symbol))
        return;

    if(PositionGetInteger(POSITION_MAGIC) != InpMagicNumber)
        return;

    long type = PositionGetInteger(POSITION_TYPE);
    double price_open = PositionGetDouble(POSITION_PRICE_OPEN);
    double sl        = PositionGetDouble(POSITION_SL);
    double volume    = PositionGetDouble(POSITION_VOLUME);

    MqlTick tick;
    if(!SymbolInfoTick(_Symbol, tick))
        return;

    int trail_points = PipsToPoints(InpTrailingStopPips);
    int step_points  = MathMax(1, PipsToPoints(InpTrailingStepPips));

    Trade.SetExpertMagicNumber(InpMagicNumber);
    Trade.SetDeviationInPoints(InpSlippagePoints);

    if(type == POSITION_TYPE_BUY)
    {
        double new_sl = tick.bid - trail_points * _Point;
        // Só move se: lucro >= trail e step atingido e SL sobe
        if(tick.bid - price_open >= trail_points * _Point)
        {
            if(sl < 1e-8 || new_sl - sl >= step_points * _Point)
            {
                if(new_sl > sl)
                    Trade.PositionModify(_Symbol, new_sl, PositionGetDouble(POSITION_TP));
            }
        }
    }
    else if(type == POSITION_TYPE_SELL)
    {
        double new_sl = tick.ask + trail_points * _Point;
        if(price_open - tick.ask >= trail_points * _Point)
        {
            if(sl < 1e-8 || sl - new_sl >= step_points * _Point)
            {
                if(new_sl < sl || sl < 1e-8)
                    Trade.PositionModify(_Symbol, new_sl, PositionGetDouble(POSITION_TP));
            }
        }
    }
}

bool IsBullishCross()
{
    double fast_prev = iMA(_Symbol, _Period, InpFastMAPeriod, 0, InpMaMethod, InpPrice, 1);
    double slow_prev = iMA(_Symbol, _Period, InpSlowMAPeriod, 0, InpMaMethod, InpPrice, 1);
    double fast_cur  = iMA(_Symbol, _Period, InpFastMAPeriod, 0, InpMaMethod, InpPrice, 0);
    double slow_cur  = iMA(_Symbol, _Period, InpSlowMAPeriod, 0, InpMaMethod, InpPrice, 0);
    return (fast_prev <= slow_prev) && (fast_cur > slow_cur);
}

bool IsBearishCross()
{
    double fast_prev = iMA(_Symbol, _Period, InpFastMAPeriod, 0, InpMaMethod, InpPrice, 1);
    double slow_prev = iMA(_Symbol, _Period, InpSlowMAPeriod, 0, InpMaMethod, InpPrice, 1);
    double fast_cur  = iMA(_Symbol, _Period, InpFastMAPeriod, 0, InpMaMethod, InpPrice, 0);
    double slow_cur  = iMA(_Symbol, _Period, InpSlowMAPeriod, 0, InpMaMethod, InpPrice, 0);
    return (fast_prev >= slow_prev) && (fast_cur < slow_cur);
}

// =============================
// MQL5 Event Handlers
// =============================
int OnInit()
{
    if(!GetSymbolTradingProperties())
    {
        Print("Falha ao ler propriedades do símbolo.");
        return INIT_FAILED;
    }

    if(InpFastMAPeriod <= 0 || InpSlowMAPeriod <= 0)
    {
        Print("Períodos de média devem ser > 0");
        return INIT_PARAMETERS_INCORRECT;
    }
    if(InpFastMAPeriod >= InpSlowMAPeriod)
    {
        Print("MA rápida deve ser menor que MA lenta.");
        return INIT_PARAMETERS_INCORRECT;
    }
    if(InpUseRisk)
    {
        if(InpRiskPerTradePercent <= 0.0 || InpRiskPerTradePercent > 100.0)
        {
            Print("Risco por trade (%) inválido.");
            return INIT_PARAMETERS_INCORRECT;
        }
        if(InpStopLossPips <= 0)
        {
            Print("Usando risco requer StopLossPips > 0.");
            return INIT_PARAMETERS_INCORRECT;
        }
    }
    if(InpUseTrailingStop && InpTrailingStopPips <= 0)
    {
        Print("TrailingStopPips deve ser > 0 quando trailing está ativo.");
        return INIT_PARAMETERS_INCORRECT;
    }

    Trade.SetExpertMagicNumber(InpMagicNumber);
    Trade.SetAsyncMode(false);

    return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
    // Nada a fazer
}

void OnTick()
{
    if(!IsWithinTradingWindow())
        return;
    if(!SpreadFilterPassed())
        return;

    // Trailing para posição existente
    TrailOpenPosition();

    // Se permitido abrir nova posição
    if(InpOnePositionPerSymbol && GetOpenPositionsCountByMagic(_Symbol, InpMagicNumber) > 0)
        return;

    bool bullish = InpAllowLong && IsBullishCross();
    bool bearish = InpAllowShort && IsBearishCross();

    if(!bullish && !bearish)
        return;

    double lots = ResolveOrderLots(InpStopLossPips);
    if(lots < min_lot - 1e-8)
        return;

    if(bullish)
        OpenBuy(lots, InpStopLossPips, InpTakeProfitPips);
    else if(bearish)
        OpenSell(lots, InpStopLossPips, InpTakeProfitPips);
}

