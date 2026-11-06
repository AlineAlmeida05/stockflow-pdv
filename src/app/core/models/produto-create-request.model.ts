export interface ProdutoCreateRequest {
    nome: string;
    categoria: string;
    precoVenda: number;
    estoqueMinimo: number;
    estoqueInicial: number;
}