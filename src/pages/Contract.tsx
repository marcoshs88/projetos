import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContractPDF } from '@/components/contracts/ContractPDF';
import { showSuccess } from '@/utils/toast';
import { FileText, Download, PlusCircle } from 'lucide-react';

const contractSchema = z.object({
  cliente: z.string().min(2, 'Nome do cliente é obrigatório'),
  documento: z.string().optional(),
  endereco: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  servico: z.string().min(5, 'Descrição do serviço é obrigatória'),
  valor_total: z.string().min(1, 'Valor total é obrigatório'),
});

type ContractFormData = z.infer<typeof contractSchema>;

const ContractPage = () => {
  const navigate = useNavigate();
  const [submittedData, setSubmittedData] = useState<ContractFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
  });

  const onSubmit = (data: ContractFormData) => {
    setSubmittedData(data);
    showSuccess('Dados do contrato validados! Agora você pode gerar o PDF ou criar o evento.');
  };

  const handleCreateEvent = () => {
    if (!submittedData) return;

    const eventData = {
      cliente: submittedData.cliente,
      data: submittedData.data,
      horario: submittedData.horario,
      local: submittedData.local,
      servico: submittedData.servico,
      valor_total: parseFloat(submittedData.valor_total),
      valor_pago: 0,
      status: 'pendente',
    };

    navigate('/eventos', { state: { prefillData: eventData } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Redigir Contrato</h1>
        <p className="text-gray-600">
          Preencha os campos abaixo para gerar o contrato e criar um evento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Contrato</CardTitle>
          <CardDescription>
            As informações preenchidas aqui serão usadas para gerar o PDF e o evento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Nome do Cliente *</Label>
                <Input id="cliente" {...register('cliente')} />
                {errors.cliente && <p className="text-sm text-red-600">{errors.cliente.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">CPF/CNPJ</Label>
                <Input id="documento" {...register('documento')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço do Cliente</Label>
              <Input id="endereco" {...register('endereco')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="local">Local do Evento *</Label>
              <Input id="local" {...register('local')} />
              {errors.local && <p className="text-sm text-red-600">{errors.local.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="servico">Serviços Contratados *</Label>
              <Textarea id="servico" {...register('servico')} />
              {errors.servico && <p className="text-sm text-red-600">{errors.servico.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total (R$) *</Label>
              <Input id="valor_total" type="number" step="0.01" {...register('valor_total')} />
              {errors.valor_total && <p className="text-sm text-red-600">{errors.valor_total.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              <FileText className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Validando...' : 'Validar Dados para Gerar Contrato'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {submittedData && (
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
            <CardDescription>
              Os dados foram validados. Agora você pode baixar o PDF ou criar o evento.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <PDFDownloadLink
              document={<ContractPDF data={submittedData} />}
              fileName={`contrato-${submittedData.cliente.replace(/\s/g, '_')}.pdf`}
            >
              {({ loading }) => (
                <Button disabled={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? 'Gerando PDF...' : 'Baixar Contrato em PDF'}
                </Button>
              )}
            </PDFDownloadLink>

            <Button variant="outline" onClick={handleCreateEvent}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Evento com estes Dados
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractPage;