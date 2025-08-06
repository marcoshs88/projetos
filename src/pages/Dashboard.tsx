import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event } from '@/types';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Plus,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const [events] = useLocalStorage<Event[]>('events', []);
  const navigate = useNavigate();

  // Calcular métricas
  const totalReceitas = events.reduce((sum, event) => sum + event.valor_total, 0);
  const totalRecebido = events.reduce((sum, event) => sum + event.valor_pago, 0);
  const totalPendente = events.reduce((sum, event) => sum + event.valor_pendente, 0);
  
  const eventosConfirmados = events.filter(e => e.status === 'confirmado').length;
  const eventosPendentes = events.filter(e => e.status === 'pendente').length;

  // Próximos eventos (próximos 7 dias)
  const hoje = new Date();
  const proximos7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const proximosEventos = events.filter(event => {
    const dataEvento = new Date(event.data);
    return dataEvento >= hoje && dataEvento <= proximos7Dias;
  }).slice(0, 5);

  // Eventos com pagamento pendente
  const pagamentosPendentes = events.filter(event => event.valor_pendente > 0).slice(0, 3);

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral do seu negócio de eventos
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/upload')}>
            <Upload className="h-4 w-4 mr-2" />
            Upload PDF
          </Button>
          <Button onClick={() => navigate('/eventos')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {eventosConfirmados} confirmados, {eventosPendentes} pendentes
            </p>
          </CardContent>
        </Card>

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
              Valor total dos contratos
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
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalPendente)}
            </div>
            <p className="text-xs text-muted-foreground">
              A receber dos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Próximos Eventos (7 dias)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximosEventos.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">Nenhum evento nos próximos 7 dias</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proximosEventos.map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.cliente}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.data)} - {event.local}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(event.valor_total)}
                      </p>
                      <p className="text-xs text-gray-500">{event.status}</p>
                    </div>
                  </div>
                ))}
                {proximosEventos.length === 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/eventos')}
                  >
                    Ver todos os eventos
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagamentos Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Pagamentos Pendentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pagamentosPendentes.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-8 w-8 text-green-400 mb-2" />
                <p className="text-green-600 font-medium">Todos os pagamentos em dia!</p>
                <p className="text-gray-500 text-sm">Nenhum pagamento pendente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pagamentosPendentes.map((event) => (
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
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/financeiro')}
                >
                  Ver gestão financeira
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      {events.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comece Agora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bem-vindo ao seu sistema de gestão de eventos!
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando seu primeiro evento ou fazendo upload de um contrato
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/eventos')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
                <Button variant="outline" onClick={() => navigate('/upload')}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload de Contrato
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;