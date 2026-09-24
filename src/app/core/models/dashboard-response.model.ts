export interface EvolucaoVendaResponse {

    data: string;

    total: number;

}

export interface PagamentoDashboardResponse {

    formaPagamento: string;

    valor: number;

}

export interface TopProdutoDashboardResponse {

    nome: string;

    quantidade: number;

}

export interface EvolucaoFiadoResponse {

    data: string;

    total: number;

}


export interface GiroEstoqueResponse {

    nome: string;

    giro: number;

}

export interface PromocaoEficienteResponse {

    nome: string;

    giro: number;

}

export interface ProdutoPromocionalResponse {

    nome: string;

    quantidade: number;

}

export interface PromocaoBaixaEfetividadeResponse {

    nome: string;

    giro: number;

}

export interface ProdutoPromocionalResponse {

    nome: string;

    quantidade: number;

}

export interface DashboardResponse {

    totalProdutos: number;

    totalVendas: number;

    faturamento: number;

    fiadosEmAberto: number;

    clientesDevedores: number;

    produtosComEstoqueBaixo: number;

    produtosSemEstoque: number;

    promocoesAtivas: number;

    evolucaoVendas: EvolucaoVendaResponse[];

    faturamentoPorPagamento: PagamentoDashboardResponse[];

    topProdutosVendidos: TopProdutoDashboardResponse[];

    evolucaoFiados: EvolucaoFiadoResponse[];

    giroEstoque:
    GiroEstoqueResponse[];

    produtosPromocionaisMaisVendidos:
    ProdutoPromocionalResponse[];

    totalVendasPromocionais:
    number;

    faturamentoPromocional:
    number;

    totalPromocoesEficientes:
    number;

    promocoesBaixaEfetividade:
    PromocaoBaixaEfetividadeResponse[];

    promocoesEficientes:
    PromocaoEficienteResponse[];


}