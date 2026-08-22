export interface MovimentacaoEstoque {

  id: string;

  produtoId: string;

  produtoNome: string;

  tipo: 'entrada' | 'saida' | 'ajuste';

  quantidade: number;

  precoCompra?: number;

  observacao?: string;

  dataMovimentacao: string;

}