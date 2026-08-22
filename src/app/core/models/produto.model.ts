export interface Produto {

  id: string;

  codigoBarras: string;

  nome: string;

  categoria: string;

  precoVenda: number;

  estoqueAtual: number;

  estoqueMinimo: number;

  ativo: boolean;

  dataCadastro: string;

  dataAtualizacao?: string;

  promocaoAtiva?: boolean;

  precoPromocional?: number;

  dataInicioPromocao?: string;

  dataFimPromocao?: string;

  promocaoMotivo?:
  | 'giro-baixo'
  | 'estoque-parado'
  | 'manual';

}