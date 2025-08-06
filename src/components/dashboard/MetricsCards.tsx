import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { DashboardMetrics } from '@/types';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: 'Receitas do Mês',
      value: formatCurrency(metrics.total_receitas),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Despesas do Mês',
      value: formatCurrency(metrics.total_despesas),
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Lucro Líquido',
      value: formatCurrency(metrics.lucro_liquido),
      icon: TrendingUp,
      color: metrics.lucro_liquido >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: metrics.lucro_liquido >= 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      title: 'Eventos do Mês',
      value: metrics.eventos_mes.toString(),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Valores Pendentes',
      value: formatCurrency(metrics.valor_pendente),
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};