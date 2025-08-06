import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit } from 'lucide-react';
import { Event } from '@/types';

interface ExtractedData {
  cliente: string;
  data: string;
  local: string;
  valor_total: number;
  valor_pago: number;
  servico: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

interface ExtractedDataFormProps {
  extractedData: ExtractedData;
  onSave: (event: Omit<Event, 'id' | 'created_at'>) => void;
  onEdit: () => void;
}

export const ExtractedDataForm = ({ extractedData, onSave, onEdit }: ExtractedDataFormProps) => {
  const [formData, setFormData] = useState<ExtractedData>(extractedData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof ExtractedData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const eventData = {
      ...formData,
      valor_pendente: formData.valor_total - formData.valor_pago
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Dados Extraídos do Contrato</span>
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) onEdit();
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancelar Edição' : 'Editar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cliente">Nome do Cliente</Label>
            {isEditing ? (
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => handleInputChange('cliente', e.target.value)}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded border">{formData.cliente}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data do Evento</Label>
            {isEditing ? (
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange('data', e.target.value)}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded border">
                {new Date(formData.data).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="local">Local do Evento</Label>
            {isEditing ? (
              <Input
                id="local"
                value={formData.local}
                onChange={(e) => handleInputChange('local', e.target.value)}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded border">{formData.local}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
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
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className={`p-2 rounded border ${
                formData.status === 'confirmado' ? 'bg-green-50 text-green-800' :
                formData.status === 'pendente' ? 'bg-yellow-50 text-yellow-800' :
                'bg-red-50 text-red-800'
              }`}>
                {formData.status}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_total">Valor Total</Label>
            {isEditing ? (
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                value={formData.valor_total}
                onChange={(e) => handleInputChange('valor_total', parseFloat(e.target.value) || 0)}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded border font-semibold text-green-600">
                {formatCurrency(formData.valor_total)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_pago">Valor Pago</Label>
            {isEditing ? (
              <Input
                id="valor_pago"
                type="number"
                step="0.01"
                value={formData.valor_pago}
                onChange={(e) => handleInputChange('valor_pago', parseFloat(e.target.value) || 0)}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded border font-semibold text-blue-600">
                {formatCurrency(formData.valor_pago)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="servico">Serviço Contratado</Label>
          {isEditing ? (
            <Textarea
              id="servico"
              value={formData.servico}
              onChange={(e) => handleInputChange('servico', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded border min-h-[80px]">{formData.servico}</p>
          )}
        </div>

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

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onEdit}>
            Processar Novo PDF
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Evento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};