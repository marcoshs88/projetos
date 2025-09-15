# Expert Advisor para MetaTrader 5

Este é um Expert Advisor (EA) básico para MetaTrader 5 que implementa uma estratégia de trading baseada no cruzamento de médias móveis.

## Características

- **Estratégia**: Cruzamento de médias móveis (10 e 20 períodos)
- **Gerenciamento de Risco**: Stop Loss e Take Profit configuráveis
- **Controle de Horário**: Trading apenas em horários específicos
- **Limite de Trades**: Máximo de trades simultâneos
- **Parâmetros Configuráveis**: Todos os parâmetros podem ser ajustados

## Parâmetros de Configuração

### Configurações Gerais
- `InpEnableTrading`: Habilitar/desabilitar o trading
- `InpMagicNumber`: Número mágico para identificar as ordens do EA
- `InpComment`: Comentário que aparecerá nas ordens

### Configurações de Trading
- `InpLotSize`: Tamanho do lote para cada trade
- `InpStopLoss`: Stop Loss em pontos
- `InpTakeProfit`: Take Profit em pontos
- `InpSlippage`: Slippage máximo aceitável

### Configurações de Tempo
- `InpStartHour`: Hora de início do trading
- `InpEndHour`: Hora de fim do trading
- `InpTradeOnFriday`: Permitir trading na sexta-feira

### Configurações de Risco
- `InpMaxRisk`: Risco máximo por trade (%)
- `InpMaxTrades`: Máximo de trades simultâneos

## Como Instalar

1. Copie o arquivo `ExpertAdvisor.mq5` para a pasta `MQL5/Experts/` do seu MetaTrader 5
2. Compile o EA no MetaEditor
3. Arraste o EA para o gráfico desejado
4. Configure os parâmetros conforme sua estratégia
5. Clique em "OK" para ativar

## Estratégia de Trading

O EA utiliza uma estratégia simples de cruzamento de médias móveis:

- **Sinal de Compra**: Quando a média móvel rápida (10 períodos) cruza acima da média móvel lenta (20 períodos)
- **Sinal de Venda**: Quando a média móvel rápida cruza abaixo da média móvel lenta

## Gerenciamento de Risco

- Stop Loss e Take Profit são aplicados automaticamente
- Limite de trades simultâneos para evitar over-trading
- Controle de horário para evitar trading em momentos de baixa liquidez
- Verificação de permissões de trading antes de executar ordens

## Avisos Importantes

⚠️ **Este EA é apenas para fins educacionais e de demonstração.**

- Teste sempre em conta demo antes de usar em conta real
- Ajuste os parâmetros conforme sua estratégia e tolerância ao risco
- Monitore o desempenho regularmente
- O trading envolve riscos significativos

## Personalização

Você pode modificar o EA para:

- Adicionar mais indicadores técnicos
- Implementar diferentes estratégias de trading
- Adicionar filtros de tendência
- Implementar trailing stop
- Adicionar notificações por email/SMS

## Suporte

Para dúvidas ou sugestões, consulte a documentação oficial do MQL5 ou fóruns especializados.

---

**Desenvolvido para MetaTrader 5**