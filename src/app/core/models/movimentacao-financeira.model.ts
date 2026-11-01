export interface MovimentacaoFinanceira {

    tipo:
        | 'fiado'
        | 'pagamento'
        | 'venda';

    clienteNome: string;

    valor: number;

    data: string;

    usuarioNome?: string;

    formaPagamento?: string;

    status?: string;

}