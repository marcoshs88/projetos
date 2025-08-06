import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { Event } from '@/types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'created_at'>) => void;
  event?: Event | null;
}

export const EventForm = ({ isOpen, onClose, onSave, event }: EventFormProps) => {
  const [formData, setFormData] = useState({
    cliente: '',
    data: '',
    local: '',
    valor_total: 0,
    valor_pago: 0,
    servico: '',
    status: 'pendente' as 'confirmado' | 'pendente' | 'cancelado'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        cliente: event.cliente,
        data: event.data,
        local: event.local,
        valor_total: event.valor_total,
        valor_pago: event.valor_pago,
        servico: event.servico,
        status: event.status
      });
    } else {
      setFormData({
        cliente: '',
        data: '',
        local: '',
        valor_total: 0,
        valor_pago: 0,
        servico: '',
        status: 'pendente'
      });
    }
    setErrors({});
  }, [event, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cliente.trim()) {
      newErrors.cliente = 'Nome do cliente é obrigatório';
    }

    if (!formData.data) {
      newErrors.data = 'Data do evento é obrigatória';
    }

    if (!formData.local.trim()) {
      newErrors.local = 'Local do evento é obrigatório';
    }

    if (formData.valor_total <= 0) {
      newErrors.valor_total = 'Valor total deve ser maior que zero';
    }

    if (formData.valor_pago < 0) {
      newErrors.valor_pago = 'Valor pago não pode ser negativo';
    }

    if (formData.valor_pago > formData.valor_total) {
      newErrors.valor_pago = 'Valor pago não pode ser maior que o valor total';
    }

    if (!formData.servico.trim()) {
      newErrors.servico = 'Descrição do serviço é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const eventData = {
      ...formData,
      valor_pendente: formData.valor_total - formData.valor_pago
    };

    onSave(eventData);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Nome do Cliente *</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => handleInputChange('cliente', e.target.value)}
                className={errors.cliente ? 'border-red-500' : ''}
              />
              {errors.cliente && (
                <p className="text-sm text-red-500">{errors.cliente}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data do Evento *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange('data', e.target.value)}
                className={errors.data ? 'border-red-500' : ''}
              />
              {errors.data && (
                <p className="text-sm text-red-500">{errors.data}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="local">Local do Evento *</Label>
              <Input
                id="local"
                value={formData.local}
                onChange={(e) => handleInputChange('local', e.target.value)}
                className={errors.local ? 'border-red-500' : ''}
              />
              {errors.local && (
                <p className="text-sm text-red-500">{errors.local}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'confirmado' | 'pendente' | 'cancelado') => 
                  handleInputChange('status', value)
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total *</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_total}
                onChange={(e) => handleInputChange('valor_total', parseFloat(e.target.value) || 0)}
                className={errors.valor_total ? 'border-red-500' : ''}
              />
              {errors.valor_total && (
                <p className="text-sm text-red-500">{errors.valor_total}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_pago">Valor Pago</Label>
              <Input
                id="valor_pago"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_pago}
                onChange={(e) => handleInputChange('valor_pago', parseFloat(e.target.value) || 0)}
                className={errors.valor_pago ? 'border-red-500' : ''}
              />
              {errors.valor_pago && (
                <p className="text-sm text-red-500">{errors.valor_pago}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servico">Descrição do Serviço *</Label>
            <Textarea
              id="servico"
              value={formData.servico}
              onChange={(e) => handleInputChange('servico', e.target.value)}
              rows={4}
              className={errors.servico ? 'border-red-500' : ''}
            />
            {errors.servico && (
              <p className="text-sm text-red-500">{errors.servico}</p>
            )}
          </div>

          {formData.valor_total > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Resumo Financeiro</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Valor Total:</p>
                  <p className="font-semibold">{formatCurrency(formData.valor_total)}</p>
                </div>
                <div>
                  <p className="text-blue-700">Valor Pago:</p>
                  <p className="font-semibold">{formatCurrency(formData.valor_pago)}</p>
                </div>
                <div>
                  <p className="text-blue-700">Valor Pendente:</p>
                  <p className="font-semibold text-orange-600">
                    {formatCurrency(formData.valor_total - formData.valor_pago)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {event ? 'Atualizar' : 'Salvar'} Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};