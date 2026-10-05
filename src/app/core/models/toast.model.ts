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

    closing?: boolean;

    timeoutId?: ReturnType<typeof setTimeout>;

}
