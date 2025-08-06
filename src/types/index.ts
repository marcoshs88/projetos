export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Event {
  id: string;
  cliente: string;
  data: string;
  horario: string;
  local: string;
  monitor: string;
  servico: string;
  observacoes: string;
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  status: 'confirmado' | 'pendente' | 'cancelado';
  created_at: string;
  payments: Payment[]; // Novo campo para pagamentos parciais
}

export interface ExtractedData {
  cliente: string;
  data: string;
  local: string;
  valor_total: number;
  valor_pago: number;
  servico: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
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