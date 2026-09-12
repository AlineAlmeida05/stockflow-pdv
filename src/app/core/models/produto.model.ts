export interface Produto {

  id: string;

  codigo?: string;

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

  custoMedio?: number;

  promocaoMotivo?:
    | 'giro-baixo'
    | 'estoque-parado'
    | 'manual'
    | 'Meta atingida';

}