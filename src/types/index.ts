export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Event {
  id: string;
  // Contratante
  cliente: string;
  documento?: string; // CPF/CNPJ
  endereco_cliente?: string;
  telefone_cliente?: string;
  
  // Evento
  data: string;
  horario: string; // Mantido para compatibilidade, mas podemos usar inicio/termino
  horario_inicio?: string;
  horario_termino?: string;
  local: string;
  nome_aniversariante?: string;
  idade_aniversariante?: string;
  numero_criancas?: string;
  
  // Serviço
  servico: string;
  monitor: string;
  observacoes: string;
  uso_imagem_autorizado?: boolean;

  // Financeiro
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  pagamento_sinal?: number;
  pagamento_restante?: number;
  
  // Status
  status: 'confirmado' | 'pendente' | 'cancelado';
  created_at: string;
  payments: Payment[];
}

export interface ExtractedData {
  cliente: string;
  data: string;
  local: string;
  valor_total: number;
  valor_pago: number;
  servico: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  horario?: string;
  horario_inicio?: string;
  horario_termino?: string;
  documento?: string;
  endereco_cliente?: string;
  telefone_cliente?: string;
  nome_aniversariante?: string;
  idade_aniversariante?: string;
  numero_criancas?: string;
  monitor?: string;
  pagamento_sinal?: number;
  pagamento_restante?: number;
  uso_imagem_autorizado?: boolean;
}

export interface Monitor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  status: 'ativo' | 'inativo';
}

export interface Location {
  id: string;
  nome: string;
  endereco: string;
  contato: string;
  capacidade: number;
}