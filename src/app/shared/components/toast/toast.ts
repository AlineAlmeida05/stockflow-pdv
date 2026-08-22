import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AlertService } from '../../../core/services/alert.service';

@Component({
    selector: 'app-toast',
    standalone: true,

    imports: [
        CommonModule
    ],

    templateUrl:
        './toast.html',

    styleUrl:
        './toast.scss'
})

export class ToastComponent {

    constructor(
        public alertService:
            AlertService
    ) { }


    getIcon(
        type: string
    ): string {

        switch (type) {

            case 'success': return '✅';

            case 'error': return '❌';

            case 'warning': return '⚠️';

            default: return 'ℹ️';

        }

    }

}