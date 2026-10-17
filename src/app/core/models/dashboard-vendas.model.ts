export interface DashboardVendas {
    resumo: ResumoVendas;
    melhorDia: MelhorDia;
    receitaPorFormaPagamento: ReceitaPorFormaPagamento[];
    evolucaoVendas: EvolucaoVendas[];
    top5Produtos: TopProduto[];
    historico: VendaHistorico[];
}

export interface ResumoVendas {
    totalVendas: number;
    faturamento: number;
    ticketMedio: number;
    formaMaisUtilizada: string;
}

export interface MelhorDia {
    data: string;
    valor: number;
}

export interface ReceitaPorFormaPagamento {
    formaPagamento: string;
    valor: number;
}

export interface EvolucaoVendas {
    data: string;
    valor: number;
}

export interface TopProduto {
    produtoNome: string;
    quantidadeVendida: number;
}

export interface VendaHistorico {
    dataHora: string;
    formaPagamento: string;
    itens: number;
    valor: number;
}