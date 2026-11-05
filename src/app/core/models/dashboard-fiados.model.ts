export interface DashboardFiados {

    resumo: {

        valorTotalFiados: number;

        valorEmAberto: number;

        valorRecebido: number;

        pendentes: number;

        pagos: number;

        clientesDevedores: number;

    };

    maioresDevedores: {

        nome: string;

        total: number;

    }[];

    ultimosLancamentos: {

        clienteNome: string;

        valor: number;

        status: string;

        dataLancamento: string;

    }[];

    evolucaoFiados: EvolucaoFiados[];

}

export interface EvolucaoFiados {

    data: string;

    valor: number;

}