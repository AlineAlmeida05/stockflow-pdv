import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../models/toast.model';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private toasts: Toast[] = [];

    private toastsSubject =
        new BehaviorSubject<Toast[]>([]);

    readonly toasts$ =
        this.toastsSubject.asObservable();

    private nextId = 1;


    private addToast(
        message: string,
        type: Toast['type']
    ): Toast {

        const toast: Toast = {

            id: this.nextId++,

            message,

            type,

            autoClose:
                type !== 'loading'

        };

        this.toasts.push(toast);

        this.toastsSubject.next(
            [...this.toasts]
        );

        if (toast.autoClose) {

            setTimeout(() => {

                this.removeToast(
                    toast.id
                );

            }, 3000);

        }

        return toast;

    }

    removeToast(
        id: number
    ): void {

        this.toasts =
            this.toasts.filter(
                toast =>
                    toast.id !== id
            );

        this.toastsSubject.next(
            [...this.toasts]
        );

    }

    success(
        message: string
    ): Toast {

        return this.addToast(
            message,
            'success'
        );

    }

    error(
        message: string
    ): Toast {

        return this.addToast(
            message,
            'error'
        );

    }

    warning(
        message: string
    ): Toast {

        return this.addToast(
            message,
            'warning'
        );

    }

    info(
        message: string
    ): Toast {

        return this.addToast(
            message,
            'info'
        );

    }

    loading(
        message: string
    ): Toast {

        return this.addToast(
            message,
            'loading'
        );

    }

}