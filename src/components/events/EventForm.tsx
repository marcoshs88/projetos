import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/types';
import { Save, X } from 'lucide-react';

const eventSchema = z.object({
  cliente: z.string().min(2, 'Nome do cliente deve ter pelo menos 2 caracteres'),
  data: z.string().min(1, 'Data é obrigatória'),
  local: z.string().min(2, 'Local deve ter pelo menos 2 caracteres'),
  servico: z.string().min(5, 'Descrição do serviço deve ter pelo menos 5 caracteres'),
  valor_total: z.number().min(0, 'Valor total deve ser positivo'),
  valor_pago: z.number().min(0, 'Valor pago deve ser positivo'),
  status: z.enum(['confirmado', 'pendente', 'cancelado'])
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSave: (data: Omit<Event, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export const EventForm = ({ event, onSave, onCancel }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      cliente: event.cliente,
      data: event.data,
      local: event.local,
      servico: event.servico,
      valor_total: event.valor_total,
      valor_pago: event.valor_pago,
      status: event.status
    } : {
      cliente: '',
      data: '',
      local: '',
      servico: '',
      valor_total: 0,
      valor_pago: 0,
      status: 'pendente'
    }
  });

  const watchedValues = watch();
  const valorPendente = watchedValues.valor_total - watchedValues.valor_pago;

  const onSubmit = (data: EventFormData) => {
    const eventData = {
      ...data,
      valor_pendente: valorPendente
    };
    onSave(eventData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {event ? 'Editar Evento' : 'Novo Evento'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Nome do Cliente *</Label>
              <Input
                id="cliente"
                {...register('cliente')}
                placeholder="Ex: Maria Silva Santos"
              />
              {errors.cliente && (
                <p className="text-sm text-red-600">{errors.cliente.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data do Evento *</Label>
              <Input
                id="data"
                type="date"
                {...register('data')}
              />
              {errors.data && (
                <p className="text-sm text-red-600">{errors.data.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="local">Local do Evento *</Label>
              <Input
                id="local"
                {...register('local')}
                placeholder="Ex: Salão de Festas Villa Real"
              />
              {errors.local && (
                <p className="text-sm text-red-600">{errors.local.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watchedValues.status}
                onValueChange={(value: 'confirmado' | 'pendente' | 'cancelado') => 
                  setValue('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total *</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                {...register('valor_total', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.valor_total && (
                <p className="text-sm text-red-600">{errors.valor_total.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_pago">Valor Pago *</Label>
              <Input
                id="valor_pago"
                type="number"
                step="0.01"
                {...register('valor_pago', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.valor_pago && (
                <p className="text-sm text-red-600">{errors.valor_pago.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servico">Descrição do Serviço *</Label>
            <Textarea
              id="servico"
              {...register('servico')}
              placeholder="Descreva detalhadamente o serviço contratado..."
              rows={4}
            />
            {errors.servico && (
              <p className="text-sm text-red-600">{errors.servico.message}</p>
            )}
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Resumo Financeiro</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Valor Total:</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(watchedValues.valor_total || 0)}
                </p>
              </div>
              <div>
                <p className="text-blue-700">Valor Pago:</p>
                <p className="font-semibold text-lg text-green-600">
                  {formatCurrency(watchedValues.valor_pago || 0)}
                </p>
              </div>
              <div>
                <p className="text-blue-700">Valor Pendente:</p>
                <p className={`font-semibold text-lg ${
                  valorPendente > 0 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {formatCurrency(valorPendente || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Evento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};