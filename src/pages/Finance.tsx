import { useState } from 'react';
import { FinanceOverview } from '@/components/finance/FinanceOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event } from '@/types';
import { showSuccess } from '@/utils/toast';
import { 
  DollarSign, 
  Calendar, 
  Filter, 
  Download,
  Search,
  CheckCircle,
  Clock
} from 'lucide-react';

const Finance = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const eventDate = new Date(event.data);
      const today = new Date();
      
      switch (dateFilter) {
        case 'this_month':
          matchesDate = eventDate.getMonth() === today.getMonth() && 
                       eventDate.getFullYear() === today.getFullYear();
          break;
        case 'next_month':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1);
          matchesDate = eventDate.getMonth() === nextMonth.getMonth() && 
                       eventDate.getFullYear() === nextMonth.getFullYear();
          break;
        case 'pending_payment':
          matchesDate = event.valor_pendente > 0;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleMarkAsPaid = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            valor_pago: event.valor_total,
            valor_pendente: 0
          }
        : event
    ));
    showSuccess('Pagamento registrado com sucesso!');
  };

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

  const exportToCSV = () => {
    const csvContent = [
      ['Cliente', 'Data', 'Local', 'Status', 'Valor Total', 'Valor Pago', 'Valor Pendente'],
      ...filteredEvents.map(event => [
        event.cliente,
        formatDate(event.data),
        event.local,
        event.status,
        event.valor_total.toString(),
        event.valor_pago.toString(),
        event.valor_pendente.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showSuccess('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600">
            Acompanhe receitas, pagamentos e pendências
          </p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Visão Geral */}
      <FinanceOverview events={events} />

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Períodos</SelectItem>
                <SelectItem value="this_month">Este Mês</SelectItem>
                <SelectItem value="next_month">Próximo Mês</SelectItem>
                <SelectItem value="pending_payment">Com Pendência</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {filteredEvents.length} evento(s) encontrado(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista Financeira */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-600">
                Ajuste os filtros para ver os eventos financeiros
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{event.cliente}</h3>
                        <Badge className={getStatusBadge(event.status)}>
                          {event.status}
                        </Badge>
                        {event.valor_pendente === 0 && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pago
                          </Badge>
                        )}
                        {event.valor_pendente > 0 && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendente
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.data)} - {event.local}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Valor Total:</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(event.valor_total)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Valor Pago:</p>
                          <p className="font-semibold text-blue-600">
                            {formatCurrency(event.valor_pago)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Valor Pendente:</p>
                          <p className={`font-semibold ${
                            event.valor_pendente > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(event.valor_pendente)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {event.valor_pendente > 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(event.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Pago
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;