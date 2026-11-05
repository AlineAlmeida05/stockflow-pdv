export interface ProdutoCreateRequest {

    nome: string;

    categoria: string;

    codigoBarras: string;

    precoVenda: number;

    estoqueAtual: number;

    estoqueMinimo: number;

    custoMedio: number;

}