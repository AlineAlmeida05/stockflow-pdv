export type FormaPagamento =
    | 'pix'
    | 'dinheiro'
    | 'debito'
    | 'credito'
    | 'fiado';

export interface VendaRequest {

    formaPagamento: FormaPagamento;

    clienteId?: string | null;

    valorRecebido?: number | null;

    itens: {
        produtoId: string;
        quantidade: number;
    }[];
}
