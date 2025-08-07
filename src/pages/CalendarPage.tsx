import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event } from '@/types';
import { DayContentProps } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage = () => {
  const [events] = useLocalStorage<Event[]>('events', []);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const eventsByDate = events.reduce((acc, event) => {
    const date = event.data;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const CustomDayContent = (props: DayContentProps) => {
    const dateStr = props.date.toISOString().split('T')[0];
    const dayEvents = eventsByDate[dateStr] || [];

    return (
      <div className="relative h-full w-full flex flex-col items-start p-2 overflow-hidden">
        <span className="text-sm font-medium">{props.date.getDate()}</span>
        {dayEvents.length > 0 && (
          <div className="mt-1 w-full space-y-1 overflow-y-auto">
            {dayEvents.map(event => (
              <Badge 
                key={event.id} 
                variant="secondary" 
                className="w-full text-left block whitespace-nowrap overflow-hidden text-ellipsis text-xs p-1"
              >
                {event.horario} - {event.cliente}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendário de Eventos</h1>
        <p className="text-gray-600">
          Visão mensal da sua agenda de eventos.
        </p>
      </div>

      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>
              {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <Calendar
            mode="single"
            selected={new Date()}
            onMonthChange={setCurrentMonth}
            className="h-full w-full"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 h-full",
              month: "space-y-4 flex flex-col h-full",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              table: "w-full border-collapse flex flex-col h-full",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
              row: "flex w-full flex-1",
              cell: "w-full text-left text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 border",
              day: "h-full w-full p-0 font-normal",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              DayContent: CustomDayContent,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;