import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventModal } from '@/components/events/EventModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event, ExtractedData } from '@/types';
import { showSuccess } from '@/utils/toast';
import { 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Edit, 
  Trash2,
  Filter,
  Clock,
  User
} from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.prefillData) {
      const prefillData = location.state.prefillData as ExtractedData;
      setEditingEvent({
        ...prefillData,
        id: '',
        created_at: '',
        horario: '18:00', // Horário padrão
        monitor: '',
        observacoes: '',
        valor_pendente: prefillData.valor_total - prefillData.valor_pago,
      });
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const filteredEvents = events.filter(event => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = event.cliente.toLowerCase().includes(lowerSearchTerm) ||
                         event.local.toLowerCase().includes(lowerSearchTerm) ||
                         event.monitor.toLowerCase().includes(lowerSearchTerm);
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      showSuccess('Evento excluído com sucesso!');
    }
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id' | 'created_at'>) => {
    if (editingEvent && editingEvent.id) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
      showSuccess('Evento atualizado com sucesso!');
    } else {
      const newEvent: Event = {
        ...eventData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      setEvents(prev => [...prev, newEvent]);
      showSuccess('Evento criado com sucesso!');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmado: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pendente;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não definida';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600">Gerencie todos os seus eventos e contratos</p>
        </div>
        <Button onClick={handleCreateEvent}><Plus className="h-4 w-4 mr-2" />Novo Evento</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center space-x-2"><Filter className="h-5 w-5" /><span>Filtros</span></CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar por cliente, local ou monitor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{events.length === 0 ? 'Nenhum evento cadastrado' : 'Nenhum evento encontrado'}</h3>
            <p className="text-gray-600 mb-4">{events.length === 0 ? 'Comece criando seu primeiro evento' : 'Tente ajustar os filtros'}</p>
            {events.length === 0 && <Button onClick={handleCreateEvent}><Plus className="h-4 w-4 mr-2" />Criar Primeiro Evento</Button>}
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{event.cliente}</CardTitle>
                    <Badge className={getStatusBadge(event.status)}>{event.status}</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditEvent(event)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <div className="flex items-center text-sm text-gray-600"><Calendar className="h-4 w-4 mr-2" />{formatDate(event.data)}</div>
                <div className="flex items-center text-sm text-gray-600"><Clock className="h-4 w-4 mr-2" />{event.horario}</div>
                <div className="flex items-center text-sm text-gray-600"><MapPin className="h-4 w-4 mr-2" />{event.local}</div>
                <div className="flex items-center text-sm text-gray-600"><User className="h-4 w-4 mr-2" />{event.monitor}</div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Total:</span><span className="font-semibold text-green-600">{formatCurrency(event.valor_total)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Pendente:</span><span className={`font-semibold ${event.valor_pendente > 0 ? 'text-orange-600' : 'text-green-600'}`}>{formatCurrency(event.valor_pendente)}</span></div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={editingEvent} onSave={handleSaveEvent} />
    </div>
  );
};

export default Events;