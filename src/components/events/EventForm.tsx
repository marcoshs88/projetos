import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Event, Payment } from '@/types';
import { Save, X, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const paymentSchema = z.object({
  id: z.string(),
  amount: z.number().min(0.01, "O valor deve ser maior que zero"),
  date: z.string().min(1, "A data é obrigatória"),
});

const eventSchema = z.object({
  cliente: z.string().min(2, 'Nome do cliente deve ter pelo menos 2 caracteres'),
  data: z.string().min(1, 'Data é obrigatória'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  monitor: z.string().min(1, 'Monitor é obrigatório'),
  servico: z.string().min(5, 'Descrição do serviço deve ter pelo menos 5 caracteres'),
  valor_total: z.number().min(0, 'Valor total deve ser positivo'),
  status: z.enum(['confirmado', 'pendente', 'cancelado']),
  observacoes: z.string().optional(),
  payments: z.array(paymentSchema).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSave: (data: Omit<Event, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export const EventForm = ({ event, onSave, onCancel }: EventFormProps) => {
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [newPaymentDate, setNewPaymentDate] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...event,
      observacoes: event?.observacoes || '',
      payments: event?.payments || [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments"
  });

  const watchedPayments = watch('payments') || [];
  const watchedValorTotal = watch('valor_total') || 0;

  const valorPago = watchedPayments.reduce((acc, p) => acc + p.amount, 0);
  const valorPendente = watchedValorTotal - valorPago;

  const handleAddPayment = () => {
    const amount = parseFloat(newPaymentAmount);
    if (amount > 0 && newPaymentDate) {
      append({
        id: crypto.randomUUID(),
        amount,
        date: newPaymentDate
      });
      setNewPaymentAmount('');
      setNewPaymentDate('');
    }
  };

  const onSubmit = (data: EventFormData) => {
    const finalData = {
      ...data,
      observacoes: data.observacoes || '',
      valor_pago: valorPago,
      valor_pendente: valorPendente,
      payments: data.payments || [],
    };
    onSave(finalData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{event ? 'Editar Evento' : 'Novo Evento'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 pt-4">
              {/* Fields for client, date, etc. - no changes here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Nome do Cliente *</Label>
                  <Input id="cliente" {...register('cliente')} />
                  {errors.cliente && <p className="text-sm text-red-600">{errors.cliente.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Controller name="status" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data do Evento *</Label>
                  <Input id="data" type="date" {...register('data')} />
                  {errors.data && <p className="text-sm text-red-600">{errors.data.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário *</Label>
                  <Input id="horario" type="time" {...register('horario')} />
                  {errors.horario && <p className="text-sm text-red-600">{errors.horario.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">Local do Evento *</Label>
                  <Input id="local" {...register('local')} />
                  {errors.local && <p className="text-sm text-red-600">{errors.local.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monitor">Monitor Responsável *</Label>
                  <Input id="monitor" {...register('monitor')} />
                  {errors.monitor && <p className="text-sm text-red-600">{errors.monitor.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="servico">Descrição do Serviço *</Label>
                <Textarea id="servico" {...register('servico')} rows={3} />
                {errors.servico && <p className="text-sm text-red-600">{errors.servico.message}</p>}
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="valor_total">Valor Total do Contrato *</Label>
                <Input id="valor_total" type="number" step="0.01" {...register('valor_total', { valueAsNumber: true })} />
                {errors.valor_total && <p className="text-sm text-red-600">{errors.valor_total.message}</p>}
              </div>

              <div className="border p-4 rounded-lg space-y-4">
                <h4 className="font-semibold">Registrar Pagamento</h4>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="new_payment_amount">Valor do Pagamento</Label>
                    <Input id="new_payment_amount" type="number" step="0.01" placeholder="Ex: 500.00" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="new_payment_date">Data do Pagamento</Label>
                    <Input id="new_payment_date" type="date" value={newPaymentDate} onChange={(e) => setNewPaymentDate(e.target.value)} />
                  </div>
                  <Button type="button" onClick={handleAddPayment}><PlusCircle className="h-4 w-4 mr-2" />Adicionar</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Histórico de Pagamentos</h4>
                {fields.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum pagamento registrado.</p>
                ) : (
                  <div className="space-y-2">
                    {fields.map((payment, index) => (
                      <div key={payment.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div className="flex gap-4">
                          <span className="font-medium">{formatCurrency(payment.amount)}</span>
                          <span className="text-gray-600">em {new Date(payment.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Resumo Financeiro</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Valor Total:</p>
                    <p className="font-semibold text-lg">{formatCurrency(watchedValorTotal)}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Valor Pago:</p>
                    <p className="font-semibold text-lg text-green-600">{formatCurrency(valorPago)}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Valor Pendente:</p>
                    <p className={`font-semibold text-lg ${valorPendente > 0 ? 'text-orange-600' : 'text-green-600'}`}>{formatCurrency(valorPendente)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="observacoes" className="pt-4">
              {/* Observations field - no changes here */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" {...register('observacoes')} rows={8} placeholder="Adicione notas, detalhes do cliente, ou informações importantes sobre o evento..." />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}><X className="h-4 w-4 mr-2" />Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}><Save className="h-4 w-4 mr-2" />{isSubmitting ? 'Salvando...' : 'Salvar Evento'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};