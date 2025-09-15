### MA_Crossover_EA (MetaTrader 5)

Este Expert Advisor (EA) implementa uma estratégia simples de cruzamento de médias móveis com gestão de risco por percentual, Stop Loss, Take Profit, trailing stop e filtros de spread/horário. Foi escrito em MQL5 para uso no MetaTrader 5.

### Instalação
- Abra o MT5 e vá em: Arquivo → Abrir Pasta de Dados.
- Coloque o arquivo `MA_Crossover_EA.mq5` em `MQL5/Experts`.
- No MetaEditor, compile o arquivo. O MT5 exibirá `MA_Crossover_EA.ex5` em Experts.

### Uso
- Anexe o EA ao gráfico do símbolo/tempo desejado.
- Ajuste os Inputs conforme sua corretora e preferência:
  - Períodos e método das médias (rápida/lenta)
  - Risco por trade (%) ou lote fixo
  - SL/TP em pips
  - Trailing stop (pips) e passo
  - MagicNumber, spread máximo, janela de negociação
  - Permitir apenas compras, apenas vendas ou ambos

### Estratégia
- Compra: quando a MA rápida cruza acima da MA lenta.
- Venda: quando a MA rápida cruza abaixo da MA lenta.
- Opcionalmente limita-se a 1 posição por símbolo+MagicNumber.

### Gestão de Risco e Lotes
- Se `Usar risco por trade` estiver habilitado, o lote é calculado com base no percentual de risco sobre a margem livre e no tamanho do SL em pips. Caso contrário, usa `Lote fixo`.

### SL/TP e Trailing
- SL e TP são definidos na abertura conforme os pips configurados.
- Trailing stop opcional move o SL a favor conforme lucro, respeitando `TrailingStep`.

### Filtros
- Spread máximo (em pips). Defina 0 para não filtrar.
- Janela de negociação (ex.: início 08:00, fim 22:00). Se vazia, opera o tempo todo.

### Backtest
- Abra o Testador de Estratégia no MT5.
- Selecione `MA_Crossover_EA` em Experts, escolha símbolo, período e intervalo.
- Use Modelagem `Cada tick baseado em ticks reais` quando possível.
- Ajuste inputs e rode o teste. Analise relatório e gráfico.

### Observações
- Valores de pip/point variam por símbolo (ex.: 5 dígitos). O EA detecta automaticamente `points_per_pip`.
- Garanta que o tamanho do lote e step sejam válidos para seu símbolo.
- Este EA é um exemplo educacional. Teste em conta demo antes de usar em real.

