export interface DashboardEstoque {

    resumo: {

        totalProdutos: number;

        semEstoque: number;

        estoqueBaixo: number;

        reposicao: number;

    };

    produtosSemMovimentacao: {

        id: string;

        nome: string;

    }[];

    sugestoesReposicao: {

        id: string;

        nome: string;

        estoqueAtual: number;

        estoqueMinimo: number;

        quantidadeReposicao: number;

    }[];

    giroEstoque: GiroProduto[];

    produtosMaiorGiro: GiroProduto[];

    produtosMenorGiro: GiroProduto[];

    produtosSemEstoque: ProdutoSemEstoque[];

    produtosEstoqueBaixo: ProdutoEstoqueBaixo[];

}

export interface GiroProduto {

    nome: string;

    comprado: number;

    vendido: number;

    giro: number;

}
export interface ProdutoSemEstoque {

    id: string;

    nome: string;

}
export interface ProdutoEstoqueBaixo {

    id: string;

    nome: string;

    estoqueAtual: number;

    estoqueMinimo: number;

}