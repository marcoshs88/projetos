//+------------------------------------------------------------------+
//|                                                ExpertAdvisor.mq5 |
//|                        Copyright 2024, MetaQuotes Software Corp. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Software Corp."
#property link      "https://www.mql5.com"
#property version   "1.00"

//--- Parâmetros de entrada
input group "=== Configurações Gerais ==="
input bool     InpEnableTrading = true;           // Habilitar trading
input int      InpMagicNumber = 123456;           // Número mágico
input string   InpComment = "EA_Basico";          // Comentário das ordens

input group "=== Configurações de Trading ==="
input double   InpLotSize = 0.1;                  // Tamanho do lote
input int      InpStopLoss = 50;                  // Stop Loss em pontos
input int      InpTakeProfit = 100;               // Take Profit em pontos
input int      InpSlippage = 3;                   // Slippage máximo

input group "=== Configurações de Tempo ==="
input int      InpStartHour = 9;                  // Hora de início
input int      InpEndHour = 17;                   // Hora de fim
input bool     InpTradeOnFriday = false;          // Negociar na sexta-feira

input group "=== Configurações de Risco ==="
input double   InpMaxRisk = 2.0;                  // Risco máximo por trade (%)
input int      InpMaxTrades = 1;                  // Máximo de trades simultâneos

//--- Variáveis globais
datetime lastBarTime = 0;
int totalTrades = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    //--- Verificar se o trading está habilitado
    if(!TerminalInfoInteger(TERMINAL_TRADE_ALLOWED))
    {
        Print("Trading não está habilitado no terminal!");
        return INIT_FAILED;
    }
    
    //--- Verificar se o EA pode negociar
    if(!MQLInfoInteger(MQL_TRADE_ALLOWED))
    {
        Print("Trading não está habilitado para este EA!");
        return INIT_FAILED;
    }
    
    //--- Verificar se o símbolo está disponível
    if(!SymbolSelect(_Symbol, true))
    {
        Print("Símbolo ", _Symbol, " não está disponível!");
        return INIT_FAILED;
    }
    
    Print("Expert Advisor inicializado com sucesso!");
    Print("Símbolo: ", _Symbol);
    Print("Período: ", EnumToString(_Period));
    Print("Magic Number: ", InpMagicNumber);
    
    return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    Print("Expert Advisor finalizado. Motivo: ", reason);
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
    //--- Verificar se o trading está habilitado
    if(!InpEnableTrading)
        return;
    
    //--- Verificar se é um novo bar
    if(!IsNewBar())
        return;
    
    //--- Verificar horário de trading
    if(!IsTradeTime())
        return;
    
    //--- Verificar se não excedeu o máximo de trades
    if(CountTrades() >= InpMaxTrades)
        return;
    
    //--- Lógica de trading
    CheckForSignals();
}

//+------------------------------------------------------------------+
//| Verificar se é um novo bar                                       |
//+------------------------------------------------------------------+
bool IsNewBar()
{
    datetime currentBarTime = iTime(_Symbol, _Period, 0);
    
    if(currentBarTime != lastBarTime)
    {
        lastBarTime = currentBarTime;
        return true;
    }
    
    return false;
}

//+------------------------------------------------------------------+
//| Verificar se está no horário de trading                          |
//+------------------------------------------------------------------+
bool IsTradeTime()
{
    MqlDateTime dt;
    TimeToStruct(TimeCurrent(), dt);
    
    //--- Verificar se é sexta-feira
    if(dt.day_of_week == 5 && !InpTradeOnFriday)
        return false;
    
    //--- Verificar horário
    if(dt.hour < InpStartHour || dt.hour >= InpEndHour)
        return false;
    
    return true;
}

//+------------------------------------------------------------------+
//| Contar número de trades ativos                                   |
//+------------------------------------------------------------------+
int CountTrades()
{
    int count = 0;
    
    for(int i = 0; i < PositionsTotal(); i++)
    {
        if(PositionGetTicket(i) > 0)
        {
            if(PositionGetString(POSITION_SYMBOL) == _Symbol &&
               PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
            {
                count++;
            }
        }
    }
    
    return count;
}

//+------------------------------------------------------------------+
//| Verificar sinais de trading                                      |
//+------------------------------------------------------------------+
void CheckForSignals()
{
    //--- Obter dados dos indicadores
    double ma_fast = iMA(_Symbol, _Period, 10, 0, MODE_SMA, PRICE_CLOSE);
    double ma_slow = iMA(_Symbol, _Period, 20, 0, MODE_SMA, PRICE_CLOSE);
    
    double ma_fast_current = 0, ma_fast_previous = 0;
    double ma_slow_current = 0, ma_slow_previous = 0;
    
    if(CopyBuffer(ma_fast, 0, 0, 2, ma_fast_current) <= 0 ||
       CopyBuffer(ma_slow, 0, 0, 2, ma_slow_current) <= 0)
    {
        Print("Erro ao obter dados dos indicadores!");
        return;
    }
    
    //--- Verificar cruzamento de médias móveis
    bool buySignal = (ma_fast_current > ma_slow_current) && 
                     (ma_fast_previous <= ma_slow_previous);
    
    bool sellSignal = (ma_fast_current < ma_slow_current) && 
                      (ma_fast_previous >= ma_slow_previous);
    
    //--- Executar trades
    if(buySignal)
    {
        OpenBuyOrder();
    }
    else if(sellSignal)
    {
        OpenSellOrder();
    }
}

//+------------------------------------------------------------------+
//| Abrir ordem de compra                                            |
//+------------------------------------------------------------------+
void OpenBuyOrder()
{
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    double price = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
    double sl = 0, tp = 0;
    
    //--- Calcular Stop Loss e Take Profit
    if(InpStopLoss > 0)
        sl = price - InpStopLoss * _Point;
    
    if(InpTakeProfit > 0)
        tp = price + InpTakeProfit * _Point;
    
    //--- Configurar requisição
    request.action = TRADE_ACTION_DEAL;
    request.symbol = _Symbol;
    request.volume = InpLotSize;
    request.type = ORDER_TYPE_BUY;
    request.price = price;
    request.sl = sl;
    request.tp = tp;
    request.deviation = InpSlippage;
    request.magic = InpMagicNumber;
    request.comment = InpComment;
    
    //--- Enviar ordem
    if(OrderSend(request, result))
    {
        if(result.retcode == TRADE_RETCODE_DONE)
        {
            Print("Ordem de compra executada com sucesso! Ticket: ", result.order);
            totalTrades++;
        }
        else
        {
            Print("Erro ao executar ordem de compra. Código: ", result.retcode);
        }
    }
    else
    {
        Print("Erro ao enviar ordem de compra. Erro: ", GetLastError());
    }
}

//+------------------------------------------------------------------+
//| Abrir ordem de venda                                             |
//+------------------------------------------------------------------+
void OpenSellOrder()
{
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    double price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    double sl = 0, tp = 0;
    
    //--- Calcular Stop Loss e Take Profit
    if(InpStopLoss > 0)
        sl = price + InpStopLoss * _Point;
    
    if(InpTakeProfit > 0)
        tp = price - InpTakeProfit * _Point;
    
    //--- Configurar requisição
    request.action = TRADE_ACTION_DEAL;
    request.symbol = _Symbol;
    request.volume = InpLotSize;
    request.type = ORDER_TYPE_SELL;
    request.price = price;
    request.sl = sl;
    request.tp = tp;
    request.deviation = InpSlippage;
    request.magic = InpMagicNumber;
    request.comment = InpComment;
    
    //--- Enviar ordem
    if(OrderSend(request, result))
    {
        if(result.retcode == TRADE_RETCODE_DONE)
        {
            Print("Ordem de venda executada com sucesso! Ticket: ", result.order);
            totalTrades++;
        }
        else
        {
            Print("Erro ao executar ordem de venda. Código: ", result.retcode);
        }
    }
    else
    {
        Print("Erro ao enviar ordem de venda. Erro: ", GetLastError());
    }
}

//+------------------------------------------------------------------+
//| Função para obter informações do EA                              |
//+------------------------------------------------------------------+
string GetEAInfo()
{
    string info = "";
    info += "=== Informações do Expert Advisor ===\n";
    info += "Símbolo: " + _Symbol + "\n";
    info += "Período: " + EnumToString(_Period) + "\n";
    info += "Magic Number: " + IntegerToString(InpMagicNumber) + "\n";
    info += "Trades Executados: " + IntegerToString(totalTrades) + "\n";
    info += "Trades Ativos: " + IntegerToString(CountTrades()) + "\n";
    info += "Trading Habilitado: " + (InpEnableTrading ? "Sim" : "Não") + "\n";
    
    return info;
}