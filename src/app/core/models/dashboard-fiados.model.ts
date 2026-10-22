export interface DashboardFiados {

    resumo: {

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

}