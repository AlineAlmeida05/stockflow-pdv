import { Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { HostListener } from '@angular/core';


type DialogType =
    'danger'
    | 'warning'
    | 'info';
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

        const dialog = this.confirmDialogService.currentDialog;

        if (!dialog) {
            return;
        }

        this.confirmDialogService.close();

        dialog.onConfirm();

    }

    cancelar(): void {

        this.confirmDialogService.close();

    }

    get dialogType(): DialogType {

        return (
            this.confirmDialogService
                .currentDialog?.type
            ?? 'warning'
        );

    }

    get dialogIcon(): string {

        return this.dialogIcons[
            this.dialogType
        ];

    }


    private readonly dialogIcons:
        Record<DialogType, string> = {

            danger: '🗑️',
            warning: '⚠️',
            info: 'ℹ️'

        };

    get confirmButtonText(): string {

        const dialog =
            this.confirmDialogService.currentDialog;

        if (dialog?.confirmText) {
            return dialog.confirmText;
        }

        return this.defaultButtonTexts[
            this.dialogType
        ];

    }

    private readonly defaultButtonTexts:
        Record<DialogType, string> = {

            danger: 'Excluir',
            warning: 'Continuar',
            info: 'Confirmar'

        };
}