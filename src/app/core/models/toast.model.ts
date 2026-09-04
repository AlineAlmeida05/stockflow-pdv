export interface Toast {

    id: number;

    message: string;

    type:
        | 'success'
        | 'error'
        | 'warning'
        | 'info'
        | 'loading';

    autoClose?: boolean;

}
