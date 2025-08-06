import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Event } from '@/types';

interface EventsCalendarProps {
  events: Event[];
}

export const EventsCalendar = ({ events }: EventsCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getMonthEvents = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return events.filter(event => {
      const eventDate = new Date(event.data);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthEvents = getMonthEvents();
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Eventos - {monthName}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monthEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum evento agendado para este mês
            </p>
          ) : (
            monthEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{event.cliente}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                      event.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(event.data)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.local}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.servico}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(event.valor_total)}
                  </p>
                  {event.valor_pendente > 0 && (
                    <p className="text-sm text-orange-600">
                      Pendente: {formatCurrency(event.valor_pendente)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};