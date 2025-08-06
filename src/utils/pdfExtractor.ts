// Simulador de extração de dados de PDF
// Em um ambiente real, isso seria feito com uma API de OCR/AI

export interface ExtractedData {
  cliente: string;
  data: string;
  local: string;
  valor_total: number;
  valor_pago: number;
  servico: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

// Dados simulados para demonstração
const sampleContracts = [
  {
    cliente: "Maria Silva Santos",
    data: "2024-02-15",
    local: "Salão de Festas Villa Real",
    valor_total: 3500.00,
    valor_pago: 1500.00,
    servico: "Festa de 15 anos com decoração temática, buffet para 80 pessoas, DJ, iluminação especial e fotografia",
    status: "confirmado" as const
  },
  {
    cliente: "João Carlos Oliveira",
    data: "2024-03-22",
    local: "Clube Recreativo Central",
    valor_total: 5200.00,
    valor_pago: 2000.00,
    servico: "Casamento com cerimônia e recepção, buffet para 120 pessoas, banda ao vivo, decoração floral",
    status: "pendente" as const
  },
  {
    cliente: "Empresa Tech Solutions Ltda",
    data: "2024-02-28",
    local: "Hotel Business Center",
    valor_total: 2800.00,
    valor_pago: 2800.00,
    servico: "Evento corporativo de fim de ano, coffee break, equipamentos audiovisuais, decoração empresarial",
    status: "confirmado" as const
  },
  {
    cliente: "Ana Paula Rodrigues",
    data: "2024-04-10",
    local: "Chácara Bela Vista",
    valor_total: 4100.00,
    valor_pago: 1000.00,
    servico: "Aniversário de 50 anos, churrasco para 60 pessoas, música ao vivo, decoração rústica",
    status: "pendente" as const
  }
];

export const extractDataFromPDF = async (file: File): Promise<ExtractedData> => {
  // Simula o tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Retorna dados simulados aleatórios
  const randomContract = sampleContracts[Math.floor(Math.random() * sampleContracts.length)];
  
  console.log(`Processando arquivo: ${file.name}`);
  console.log('Dados extraídos:', randomContract);
  
  return randomContract;
};

// Função para validar se o arquivo é um PDF válido
export const validatePDFFile = (file: File): boolean => {
  return file.type === 'application/pdf' && file.size > 0;
};

// Função para formatar dados extraídos
export const formatExtractedData = (data: ExtractedData): ExtractedData => {
  return {
    ...data,
    cliente: data.cliente.trim(),
    local: data.local.trim(),
    servico: data.servico.trim(),
    valor_total: Number(data.valor_total.toFixed(2)),
    valor_pago: Number(data.valor_pago.toFixed(2))
  };
};