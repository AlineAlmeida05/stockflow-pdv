export interface Fiado {

    id: string;

    clienteId: string;

    clienteNome: string;

    vendaId?: string;

    valorTotal: number;

    dataLancamento: string;

    status:
    | 'pendente'
    | 'parcial'
    | 'quitado';

    observacao?: string;

}