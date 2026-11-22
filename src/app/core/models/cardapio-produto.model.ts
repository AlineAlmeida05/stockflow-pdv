export interface CardapioProduto {
    id: string;
    nome: string;
    categoria: string;
    preco: number;
    estoque: number;
    imagemUrl: string | null;
}