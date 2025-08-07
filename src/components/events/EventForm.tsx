import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Event } from '@/types';
import { Save, X } from 'lucide-react';

const eventSchema = z.object({
  cliente: z.string().min(2, 'Nome do cliente deve ter pelo menos 2 caracteres'),
  documento: z.string().optional(),
  telefone_cliente: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  monitor: z.string().min(1, 'Monitor é obrigatório'),
  servico: z.string().min(5, 'Descrição do serviço deve ter pelo menos 5 caracteres'),
  valor_total: z.number().min(0, 'Valor total deve ser positivo'),
  valor_pago: z.number().min(0, 'Valor pago deve ser positivo'),
  status: z.enum(['confirmado', 'pendente', 'cancelado']),
  observacoes: z.string().optional(),
  nome_aniversariante: z.string().optional(),
  idade_aniversariante: z.string().optional(),
  numero_criancas: z.string().optional(),
  uso_imagem_autorizado: z.boolean().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Partial<Event>;
  onSave: (data: Omit<Event, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export const EventForm = ({ event, onSave, onCancel }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...event,
      observacoes: event?.observacoes || '',
      valor_pago: event?.valor_pago || 0,
    }
  });

  const watchedValorTotal = watch('valor_total') || 0;
  const watchedValorPago = watch('valor_pago') || 0;
  const valorPendente = watchedValorTotal - watchedValorPago;

  const onSubmit = (data: EventFormData) => {
    const finalData = {
      ...data,
      observacoes: data.observacoes || '',
      valor_pendente: valorPendente,
      payments: event?.payments || [],
    };
    onSave(finalData as Omit<Event, 'id' | 'created_at'>);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-0 shadow-none">
      <CardContent className="p-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Info Principal</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="detalhes">Outros Detalhes</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 pt-6">
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
                  <Input id="horario" type="text" {...register('horario')} placeholder="Ex: 18:00 - 22:00" />
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

            <TabsContent value="financeiro" className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor_total">Valor Total do Contrato *</Label>
                  <Input id="valor_total" type="number" step="0.01" {...register('valor_total', { valueAsNumber: true })} />
                  {errors.valor_total && <p className="text-sm text-red-600">{errors.valor_total.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor_pago">Valor Pago (Sinal) *</Label>
                  <Input id="valor_pago" type="number" step="0.01" {...register('valor_pago', { valueAsNumber: true })} />
                  {errors.valor_pago && <p className="text-sm text-red-600">{errors.valor_pago.message}</p>}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Resumo Financeiro</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Valor Pendente:</span>
                  <span className={`font-semibold text-lg ${valorPendente > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPendente)}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detalhes" className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_aniversariante">Nome do Aniversariante</Label>
                  <Input id="nome_aniversariante" {...register('nome_aniversariante')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade_aniversariante">Idade a Comemorar</Label>
                  <Input id="idade_aniversariante" {...register('idade_aniversariante')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero_criancas">Nº de Crianças</Label>
                  <Input id="numero_criancas" {...register('numero_criancas')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone_cliente">Telefone do Cliente</Label>
                  <Input id="telefone_cliente" {...register('telefone_cliente')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" {...register('observacoes')} rows={4} placeholder="Alergias, necessidades especiais, etc." />
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="uso_imagem_autorizado"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="uso_imagem_autorizado_event"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="uso_imagem_autorizado_event">
                  Cliente autorizou uso de imagem.
                </Label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-8">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}><X className="h-4 w-4 mr-2" />Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}><Save className="h-4 w-4 mr-2" />{isSubmitting ? 'Salvando...' : 'Salvar Evento'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};