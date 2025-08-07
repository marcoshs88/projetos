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
import { Checkbox } from '@/components/ui/checkbox';
import { ContractPDF } from '@/components/contracts/ContractPDF';
import { showSuccess } from '@/utils/toast';
import { FileText, Download, PlusCircle } from 'lucide-react';

const contractSchema = z.object({
  // Contratante
  cliente: z.string().min(2, 'Nome do cliente é obrigatório'),
  documento: z.string().optional(),
  endereco_cliente: z.string().optional(),
  telefone_cliente: z.string().optional(),
  
  // Evento
  data: z.string().min(1, 'Data é obrigatória'),
  horario_inicio: z.string().min(1, 'Horário de início é obrigatório'),
  horario_termino: z.string().min(1, 'Horário de término é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  nome_aniversariante: z.string().optional(),
  idade_aniversariante: z.string().optional(),
  numero_criancas: z.string().optional(),
  
  // Serviço
  servico: z.string().min(5, 'Descrição do serviço é obrigatória'),
  monitor: z.string().min(1, 'Monitor é obrigatório'),
  uso_imagem_autorizado: z.boolean().default(false),

  // Financeiro
  valor_total: z.string().min(1, 'Valor total é obrigatório'),
  pagamento_sinal: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

const ContractPage = () => {
  const navigate = useNavigate();
  const [submittedData, setSubmittedData] = useState<ContractFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
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

    const valorTotal = parseFloat(submittedData.valor_total);
    const valorSinal = submittedData.pagamento_sinal ? parseFloat(submittedData.pagamento_sinal) : 0;

    const eventData = {
      ...submittedData,
      valor_total: valorTotal,
      valor_pago: valorSinal,
      status: 'pendente',
      horario: `${submittedData.horario_inicio} - ${submittedData.horario_termino}`,
      pagamento_sinal: valorSinal,
      pagamento_restante: valorTotal - valorSinal,
      observacoes: '',
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
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contratante */}
            <fieldset className="space-y-4 border-t pt-6">
              <legend className="text-lg font-medium">Dados do Contratante</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Nome Completo *</Label>
                  <Input id="cliente" {...register('cliente')} />
                  {errors.cliente && <p className="text-sm text-red-600">{errors.cliente.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento">CPF/CNPJ</Label>
                  <Input id="documento" {...register('documento')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco_cliente">Endereço</Label>
                  <Input id="endereco_cliente" {...register('endereco_cliente')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone_cliente">Telefone</Label>
                  <Input id="telefone_cliente" {...register('telefone_cliente')} />
                </div>
              </div>
            </fieldset>

            {/* Evento */}
            <fieldset className="space-y-4 border-t pt-6">
              <legend className="text-lg font-medium">Dados do Evento</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data do Evento *</Label>
                  <Input id="data" type="date" {...register('data')} />
                  {errors.data && <p className="text-sm text-red-600">{errors.data.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="horario_inicio">Início *</Label>
                    <Input id="horario_inicio" type="time" {...register('horario_inicio')} />
                    {errors.horario_inicio && <p className="text-sm text-red-600">{errors.horario_inicio.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario_termino">Término *</Label>
                    <Input id="horario_termino" type="time" {...register('horario_termino')} />
                    {errors.horario_termino && <p className="text-sm text-red-600">{errors.horario_termino.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">Local do Evento *</Label>
                  <Input id="local" {...register('local')} />
                  {errors.local && <p className="text-sm text-red-600">{errors.local.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_aniversariante">Nome do Aniversariante</Label>
                  <Input id="nome_aniversariante" {...register('nome_aniversariante')} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="idade_aniversariante">Idade do Aniversariante</Label>
                  <Input id="idade_aniversariante" {...register('idade_aniversariante')} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="numero_criancas">Nº aproximado de crianças</Label>
                  <Input id="numero_criancas" {...register('numero_criancas')} />
                </div>
              </div>
            </fieldset>

            {/* Serviço e Financeiro */}
            <fieldset className="space-y-4 border-t pt-6">
              <legend className="text-lg font-medium">Serviços e Pagamento</legend>
              <div className="space-y-2">
                <Label htmlFor="servico">Serviços Inclusos *</Label>
                <Textarea id="servico" {...register('servico')} placeholder="Ex: Recreação com 2 monitores, oficina de slime, caça ao tesouro..." />
                {errors.servico && <p className="text-sm text-red-600">{errors.servico.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monitor">Monitor(es) Responsável(is) *</Label>
                <Input id="monitor" {...register('monitor')} />
                {errors.monitor && <p className="text-sm text-red-600">{errors.monitor.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor_total">Valor Total (R$) *</Label>
                  <Input id="valor_total" type="number" step="0.01" {...register('valor_total')} />
                  {errors.valor_total && <p className="text-sm text-red-600">{errors.valor_total.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pagamento_sinal">Sinal (R$)</Label>
                  <Input id="pagamento_sinal" type="number" step="0.01" {...register('pagamento_sinal')} />
                </div>
              </div>
            </fieldset>
            
            <div className="flex items-center space-x-2 border-t pt-6">
              <Checkbox id="uso_imagem_autorizado" {...register('uso_imagem_autorizado')} />
              <Label htmlFor="uso_imagem_autorizado">
                O cliente autoriza o uso de imagem do evento para divulgação nas redes sociais da contratada.
              </Label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
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
          <CardContent className="flex flex-col md:flex-row gap-4">
            <PDFDownloadLink
              document={<ContractPDF data={submittedData} />}
              fileName={`contrato-${submittedData.cliente.replace(/\s/g, '_')}.pdf`}
              className="w-full md:w-auto"
            >
              {({ loading }) => (
                <Button disabled={loading} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? 'Gerando PDF...' : 'Baixar Contrato em PDF'}
                </Button>
              )}
            </PDFDownloadLink>

            <Button variant="outline" onClick={handleCreateEvent} className="w-full md:w-auto">
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