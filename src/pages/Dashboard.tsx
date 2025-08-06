import { useEffect, useState } from 'react';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { EventsCalendar } from '@/components/dashboard/EventsCalendar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event, Transaction, DashboardMetrics } from '@/types';

const Dashboard = () => {
  const [events] = useLocalStorage<Event[]>('events', []);
  const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_receitas: 0,
    total_despesas: 0,
    lucro_liquido: 0,
    eventos_mes: 0,
    valor_pendente: 0
  });

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calcular métricas do mês atual
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.data);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.data);
      return eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    });

    const totalReceitas = monthTransactions
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);

    const totalDespesas = monthTransactions
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);

    const valorPendente = events.reduce((sum, event) => sum + event.valor_pendente, 0);

    setMetrics({
      total_receitas: totalReceitas,
      total_despesas: totalDespesas,
      lucro_liquido: totalReceitas - totalDespesas,
      eventos_mes: monthEvents.length,
      valor_pendente: valorPendente
    });
  }, [events, transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio de eventos</p>
      </div>

      <MetricsCards metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventsCalendar events={events} />
        
        <div className="space-y-6">
          {/* Aqui podemos adicionar mais componentes como gráficos, etc */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;