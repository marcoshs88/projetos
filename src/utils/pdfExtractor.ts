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
  },
  {
    cliente: "Carlos Eduardo Mendes",
    data: "2024-03-05",
    local: "Espaço Eventos Jardim",
    valor_total: 6800.00,
    valor_pago: 3000.00,
    servico: "Formatura de medicina, jantar para 150 pessoas, cerimônia de colação, fotografia profissional",
    status: "confirmado" as const
  }
];

// Função para gerar hash simples baseado no nome e tamanho do arquivo
const generateFileHash = (file: File): number => {
  let hash = 0;
  const str = file.name + file.size.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const extractDataFromPDF = async (file: File): Promise<ExtractedData> => {
  // Simula o tempo de processamento de OCR/IA
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Gera índice baseado no arquivo para consistência
  const fileHash = generateFileHash(file);
  const contractIndex = fileHash % sampleContracts.length;
  const selectedContract = sampleContracts[contractIndex];
  
  // Adiciona pequenas variações baseadas no arquivo para parecer mais real
  const variations = {
    cliente: selectedContract.cliente,
    data: selectedContract.data,
    local: selectedContract.local,
    valor_total: selectedContract.valor_total + (fileHash % 100), // Pequena variação no valor
    valor_pago: selectedContract.valor_pago,
    servico: selectedContract.servico,
    status: selectedContract.status
  };
  
  console.log(`Processando arquivo: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
  console.log('Hash do arquivo:', fileHash);
  console.log('Dados extraídos:', variations);
  
  return variations;
};

// Função para validar se o arquivo é um PDF válido
export const validatePDFFile = (file: File): boolean => {
  const isValidType = file.type === 'application/pdf';
  const isValidSize = file.size > 0 && file.size < 10 * 1024 * 1024; // Máximo 10MB
  
  if (!isValidType) {
    console.error('Tipo de arquivo inválido:', file.type);
  }
  if (!isValidSize) {
    console.error('Tamanho de arquivo inválido:', file.size);
  }
  
  return isValidType && isValidSize;
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

// Função para simular diferentes tipos de erro que podem ocorrer
export const simulateExtractionErrors = (file: File): string | null => {
  const fileHash = generateFileHash(file);
  
  // 5% de chance de erro simulado
  if (fileHash % 20 === 0) {
    return "PDF com qualidade de imagem muito baixa para extração";
  }
  
  // 3% de chance de erro de formato
  if (fileHash % 33 === 0) {
    return "Formato de contrato não reconhecido";
  }
  
  return null; // Sem erro
};