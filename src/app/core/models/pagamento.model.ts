export interface Pagamento {

    id: string;

    clienteId: string;

    clienteNome: string;

    valorPago: number;

    dataPagamento: string;

    observacao?: string;

}