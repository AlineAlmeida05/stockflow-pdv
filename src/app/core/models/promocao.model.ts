export interface Promocao {

    id: string;

    produto: {
        id: string;
        nome: string;
    };

    precoOriginal: number;

    precoPromocional: number;

    percentualDesconto: number;

    motivo: string;

    ativa: boolean;

    dataInicio: string;

    dataFim?: string;

    estoqueInicio: number;

    metaUnidades: number;

    unidadesVendidas: number;

    receitaGerada: number;
}