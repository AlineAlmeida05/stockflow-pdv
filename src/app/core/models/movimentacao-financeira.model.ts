export interface MovimentacaoFinanceira {

    tipo:
        | 'fiado'
        | 'pagamento';

    clienteNome: string;

    valor: number;

    data: string;

    usuarioNome?: string;

    formaPagamento?: string;

}
``