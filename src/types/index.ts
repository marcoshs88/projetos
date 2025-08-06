export interface Event {
  id: string;
  cliente: string;
  data: string;
  local: string;
  servico: string;
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