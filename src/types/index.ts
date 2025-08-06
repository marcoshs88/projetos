export interface Event {
  id: string;
  cliente: string;
  data: string;
  horario: string; // Novo campo
  local: string; // Será preenchido pela lista de locais
  monitor: string; // Será preenchido pela lista de monitores
  servico: string;
  observacoes: string; // Novo campo
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  status: 'confirmado' | 'pendente' | 'cancelado';
  created_at: string;
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