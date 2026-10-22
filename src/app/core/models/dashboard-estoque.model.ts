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

}