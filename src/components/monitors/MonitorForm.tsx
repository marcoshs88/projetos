import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor } from '@/types';
import { Save, X } from 'lucide-react';

const monitorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  status: z.enum(['ativo', 'inativo'])
});

type MonitorFormData = z.infer<typeof monitorSchema>;

interface MonitorFormProps {
  monitor?: Monitor;
  onSave: (data: Omit<Monitor, 'id'>) => void;
  onCancel: () => void;
}

export const MonitorForm = ({ monitor, onSave, onCancel }: MonitorFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<MonitorFormData>({
    resolver: zodResolver(monitorSchema),
    defaultValues: monitor || {
      nome: '',
      telefone: '',
      email: '',
      status: 'ativo'
    }
  });

  const watchedStatus = watch('status');

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" {...register('nome')} />
        {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone *</Label>
        <Input id="telefone" {...register('telefone')} />
        {errors.telefone && <p className="text-sm text-red-600">{errors.telefone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={watchedStatus}
          onValueChange={(value: 'ativo' | 'inativo') => setValue('status', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};