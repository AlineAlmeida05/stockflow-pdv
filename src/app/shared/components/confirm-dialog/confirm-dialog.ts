import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { HostListener } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [
        AsyncPipe
    ],
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.scss'
})

export class ConfirmDialog {

    constructor(
        public confirmDialogService:
            ConfirmDialogService
    ) { }

    @HostListener(
        'document:keydown.escape'
    )
    onEscape(): void {

        this.cancelar();

    }

    confirmar(): void {

        const dialog =
            this.confirmDialogService
                .currentDialog;

        if (!dialog) {
            return;
        }

        dialog.onConfirm();

        this.confirmDialogService.close();

    }

    cancelar(): void {

        this.confirmDialogService.close();

    }

}