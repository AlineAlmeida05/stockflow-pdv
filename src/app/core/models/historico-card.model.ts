export interface HistoricoCard {

    title: string;

    value: string | number;

    variant:
        | 'info'
        | 'success'
        | 'warning'
        | 'danger';
}