export interface Pagamento {

    id: string;

    clienteId: string;

    clienteNome: string;

    valorPago: number;

    dataPagamento: string;

    usuarioNome: string;

    formaPagamento?: string;

    observacao?: string;

}