import { Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { HostListener } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [
        AsyncPipe,
        NgClass
    ],
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.scss'
})

export class ConfirmDialog {

    constructor(
        public confirmDialogService: ConfirmDialogService
    ) { }

    @HostListener('document:keydown.escape')
    onEscape(): void {

        if (
            !this.confirmDialogService.currentDialog
        ) {
            return;
        }

        this.cancelar();
    }

    confirmar(): void {

        const dialog =
            this.confirmDialogService
                .currentDialog;

        if (!dialog) {
            return;
        }

        this.confirmDialogService.close();

        dialog.onConfirm();

    }

    cancelar(): void {

        this.confirmDialogService.close();

    }

    get dialogType(): string {

        return (
            this.confirmDialogService
                .currentDialog?.type
            ?? 'warning'
        );

    }

    get dialogIcon(): string {

        switch (this.dialogType) {

            case 'danger':
                return '🗑️';

            case 'warning':
                return '⚠️';

            case 'info':
                return 'ℹ️';

            default:
                return '⚠️';

        }

    }


    get confirmButtonText(): string {

        const dialog =
            this.confirmDialogService
                .currentDialog;

        if (dialog?.confirmText) {
            return dialog.confirmText;
        }

        switch (dialog?.type) {

            case 'danger':
                return 'Excluir';

            case 'warning':
                return 'Continuar';

            case 'info':
                return 'Confirmar';

            default:
                return 'Confirmar';

        }

    }
}