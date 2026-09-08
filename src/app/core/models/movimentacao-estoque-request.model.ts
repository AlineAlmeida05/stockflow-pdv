export interface MovimentacaoEstoqueRequest {

    produtoId: string;

    tipo: 'entrada' | 'saida' | 'ajuste';

    quantidade: number;

    precoCompra?: number;

    observacao?: string;

}