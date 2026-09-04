import { Component, Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { ActionIcons } from '../action-icons/action-icons';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [
        ActionIcons,
        StatusBadge
    ],
    templateUrl: './data-table.html',
    styleUrl: './data-table.scss'
})
export class DataTable {

    @Input()

    columns: {
        field: string;
        header: string;
        type?: | 'text' | 'badge' | 'currency' | 'date';
        align?: 'left' | 'center' | 'right';
    }[] = [];

    @Input()
    data: unknown[] = [];

    @Input()
    showActions = false;

    @Input()
    showEditAction = true;

    @Output()
    edit = new EventEmitter<unknown>();

    @Output()
    delete = new EventEmitter<unknown>();

    @Output()
    rowClick =
        new EventEmitter<unknown>();

    obterVariantStatus(
        status: string
    ): 'success' | 'warning' | 'danger' {

        switch (status) {

            case 'Baixo':
                return 'danger';

            case 'Atenção':
                return 'warning';

            default:
                return 'success';

        }

    }

    formatCurrency(
        value: unknown
    ): string {

        const numberValue =
            Number(value);

        if (isNaN(numberValue)) {

            return '-';

        }

        return numberValue.toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        );

    }

    formatDate(
        value: unknown
    ): string {

        if (!value) {

            return '-';

        }

        const date = new Date(
            String(value)
        );

        if (
            isNaN(date.getTime())
        ) {

            return '-';

        }

        return date.toLocaleDateString(
            'pt-BR'
        );

    }
}