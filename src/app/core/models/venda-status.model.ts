export type VendaStatus =
    | 'finalizada'
    | 'cancelada';

export const VENDA_STATUS_LABELS:
    Record<VendaStatus, string> = {

    finalizada: 'Finalizada',

    cancelada: 'Cancelada'
};