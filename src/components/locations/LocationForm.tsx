import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Location } from '@/types';
import { Save, X } from 'lucide-react';

const locationSchema = z.object({
  nome: z.string().min(2, 'Nome do local deve ter pelo menos 2 caracteres'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  contato: z.string().min(10, 'Contato inválido'),
  capacidade: z.number().min(1, 'Capacidade deve ser maior que zero')
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormProps {
  location?: Location;
  onSave: (data: Omit<Location, 'id'>) => void;
  onCancel: () => void;
}

export const LocationForm = ({ location, onSave, onCancel }: LocationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: location || {
      nome: '',
      endereco: '',
      contato: '',
      capacidade: 0
    }
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Local *</Label>
        <Input id="nome" {...register('nome')} />
        {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="endereco">Endereço *</Label>
        <Input id="endereco" {...register('endereco')} />
        {errors.endereco && <p className="text-sm text-red-600">{errors.endereco.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contato">Contato (Telefone/Email) *</Label>
        <Input id="contato" {...register('contato')} />
        {errors.contato && <p className="text-sm text-red-600">{errors.contato.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacidade">Capacidade *</Label>
        <Input id="capacidade" type="number" {...register('capacidade', { valueAsNumber: true })} />
        {errors.capacidade && <p className="text-sm text-red-600">{errors.capacidade.message}</p>}
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