export interface Event {
  id: string;
  cliente: string;
  data: string;
  local: string;
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  servico: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  created_at: string;
}

export interface Transaction {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  data: string;
  categoria: string;
  descricao: string;
  evento_id?: string;
  created_at: string;
}

export interface Monitor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  especialidade: string;
  valor_hora: number;
  created_at: string;
}

export interface Local {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;
  valor_locacao: number;
  contato: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_receitas: number;
  total_despesas: number;
  lucro_liquido: number;
  eventos_mes: number;
  valor_pendente: number;
}