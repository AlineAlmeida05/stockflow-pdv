export interface PedidoDeliveryItem {
    produto: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface PedidoDeliveryDetalhe {
    id: string;
    numero: string;

    clienteNome: string;
    telefone: string;

    formaPagamento: string;

    endereco: string;
    complemento: string;
    observacao: string;

    valorTotal: number;

    status: string;

    dataPedido: string;
    dataEntrega: string | null;

    horaSaidaEntrega: string | null;

    tempoEntregaMinutos: number | null;

    vendaId: string | null;

    itens: PedidoDeliveryItem[];
}
