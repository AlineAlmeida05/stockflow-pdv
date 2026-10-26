import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../core/services/alert.service';

type ToastType =
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'loading';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './toast.html',
    styleUrl: './toast.scss'
})

export class ToastComponent {

    constructor(
        public alertService: AlertService
    ) { }


    getIcon(
        type: ToastType
    ): string {

        return this.icons[type];

    }

    private readonly icons:
        Record<ToastType, string> = {

            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            loading: '🔄'

        };

}