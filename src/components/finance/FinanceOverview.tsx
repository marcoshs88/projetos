import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface FinanceOverviewProps {
  events: Event[];
}

export const FinanceOverview = ({ events }: FinanceOverviewProps) => {
  // Calcular métricas financeiras
  const totalReceitas = events.reduce((sum, event) => sum + event.valor_total, 0);
  const totalRecebido = events.reduce((sum, event) => sum + event.valor_pago, 0);
  const totalPendente = events.reduce((sum, event) => sum + event.valor_pendente, 0);
  
  // Eventos por status
  const eventosConfirmados = events.filter(e => e.status === 'confirmado').length;
  const eventosPendentes = events.filter(e => e.status === 'pendente').length;
  const eventosCancelados = events.filter(e => e.status === 'cancelado').length;

  // Próximos vencimentos (eventos pendentes nos próximos 30 dias)
  const hoje = new Date();
  const proximos30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const proximosVencimentos = events.filter(event => {
    const dataEvento = new Date(event.data);
    return event.valor_pendente > 0 && 
           dataEvento >= hoje && 
           dataEvento <= proximos30Dias;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalReceitas)}
            </div>
            <p className="text-xs text-muted-foreground">
              {events.length} eventos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Recebido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRecebido)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalRecebido / totalReceitas) * 100 || 0).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalPendente)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalPendente / totalReceitas) * 100 || 0).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((eventosConfirmados / events.length) * 100 || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {eventosConfirmados} de {events.length} confirmados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {eventosConfirmados}
              </div>
              <Badge className="bg-green-100 text-green-800">
                Confirmados
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {eventosPendentes}
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                Pendentes
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {eventosCancelados}
              </div>
              <Badge className="bg-red-100 text-red-800">
                Cancelados
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximos Vencimentos */}
      {proximosVencimentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Próximos Vencimentos (30 dias)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximosVencimentos.slice(0, 5).map((event) => (
                <div key={event.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.cliente}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.data)} - {event.local}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">
                      {formatCurrency(event.valor_pendente)}
                    </p>
                    <p className="text-xs text-gray-500">pendente</p>
                  </div>
                </div>
              ))}
              {proximosVencimentos.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  +{proximosVencimentos.length - 5} outros vencimentos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};