export interface PedidoDeliveryResumo {

    id: string;

    numero: string;

    clienteNome: string;

    telefone: string;

    formaPagamento: string | null;

    quantidadeProdutos: number;

    valorTotal: number;

    status: string;

    dataPedido: string;

    horaPedido: string;

    atrasado: boolean;
}
