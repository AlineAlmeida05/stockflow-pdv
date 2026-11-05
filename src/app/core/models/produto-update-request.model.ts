export interface ProdutoUpdateRequest {

    nome: string;

    categoria: string;

    codigoBarras: string;

    precoVenda: number;

    estoqueAtual: number;

    estoqueMinimo: number;

    ativo: boolean;

    custoMedio: number;

}