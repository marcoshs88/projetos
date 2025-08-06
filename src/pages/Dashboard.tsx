import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event } from '@/types';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [events] = useLocalStorage<Event[]>('events', []);

  // Calcular métricas
  const totalReceitas = events.reduce((sum, event) => sum + event.valor_total, 0);
  const totalRecebido = events.reduce((sum, event) => sum + event.valor_pago, 0);
  const totalPendente = events.reduce((sum, event) => sum + event.valor_pendente, 0);
  
  const eventosConfirmados = events.filter(e => e.status === 'confirmado').length;
  const eventosPendentes = events.filter(e => e.status === 'pendente').length;

  // Próximos eventos (próximos 7 dias)
  const hoje = new Date();
  const proximos7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const proximosEventos = events
    .filter(event => {
      const dataEvento = new Date(event.data);
      return dataEvento >= hoje && dataEvento <= proximos7Dias;
    })
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 5);

  // Eventos com pagamento pendente
  const pagamentosPendentes = events
    .filter(event => event.valor_pendente > 0)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmado: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pendente;
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
          <Link to="/upload">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
            </Button>
          </Link>
          <Link to="/eventos">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </Link>
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
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Próximos Eventos (7 dias)</span>
              </span>
              <Link to="/eventos">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximosEventos.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Nenhum evento nos próximos 7 dias
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {proximosEventos.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium">{event.cliente}</p>
                        <Badge className={getStatusBadge(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.data)} - {event.local}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(event.valor_total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagamentos Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pagamentos Pendentes</span>
              </span>
              <Link to="/financeiro">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pagamentosPendentes.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-8 w-8 text-green-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Todos os pagamentos em dia!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pagamentosPendentes.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{event.cliente}</p>
                      <p className="text-sm text-gray-600">
                        Evento: {formatDate(event.data)}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/eventos">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Plus className="h-6 w-6" />
                <span>Criar Novo Evento</span>
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Upload className="h-6 w-6" />
                <span>Upload de Contrato</span>
              </Button>
            </Link>
            <Link to="/financeiro">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Relatório Financeiro</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Estado Vazio */}
      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Bem-vindo ao seu Dashboard!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Comece criando seu primeiro evento ou fazendo upload de um contrato 
              para ver suas métricas e relatórios aqui.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/eventos">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </Link>
              <Link to="/upload">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload de Contrato
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;