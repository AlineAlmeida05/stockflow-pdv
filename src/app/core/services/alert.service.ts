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
    ): void {

        const toast: Toast = {

            id: this.nextId++,

            message,

            type

        };

        this.toasts.push(toast);

        this.toastsSubject.next(
            [...this.toasts]
        );

        setTimeout(() => {

            this.removeToast(
                toast.id
            );

        }, 3000);

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
    ): void {

        this.addToast(
            message,
            'success'
        );

    }

    error(
        message: string
    ): void {

        this.addToast(
            message,
            'error'
        );

    }

    warning(
        message: string
    ): void {

        this.addToast(
            message,
            'warning'
        );

    }

    info(
        message: string
    ): void {

        this.addToast(
            message,
            'info'
        );

    }

}