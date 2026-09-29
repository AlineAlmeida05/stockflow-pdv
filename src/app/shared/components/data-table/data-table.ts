import { Component, Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { ActionIcons } from '../action-icons/action-icons';

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [
        ActionIcons
    ],
    templateUrl: './data-table.html',
    styleUrl: './data-table.scss',
})
export class DataTable {

    @Input()
    columns: {
        field: string;
        header: string;
        type?: 'text' | 'badge' | 'currency' | 'date' | 'toggle' | 'progress';
        align?: 'left' | 'center' | 'right';
        badgeVariantField?: string;
    }[] = [];

    @Input()
    data: unknown[] = [];

    @Input()
    showActions = false;

    @Input()
    showEditAction = true;

    @Input()
    deleteIcon = '🗑️';

    @Output()
    edit = new EventEmitter<unknown>();

    @Output()
    delete = new EventEmitter<unknown>();

    @Output()
    rowClick =
        new EventEmitter<unknown>();

    @Input()
    actionsHeader = 'Ações';

    @Input()
    clickableRows = false;

    @Output()
    toggle = new EventEmitter

    obterVariantStatus(
        status: string
    ): 'success' | 'warning' | 'danger' {

        switch (status) {

            case 'GERENTE':
            case 'Ativo':
                return 'success';

            case 'OPERADOR_CAIXA':
                return 'warning';

            case 'ESTOQUISTA':
            case 'Inativo':
                return 'danger';

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

    getBadgeClass(
        value: string
    ): string {

        switch (value) {

            case 'Ativo':
            case 'Em Dia':
            case 'Em Estoque':
                return 'status-success';

            case 'Atenção':
            case 'Devedor':
                return 'status-warning';

            case 'Inativo':
            case 'Inadimplente':
            case 'Crítico':
                return 'status-danger';

            default:
                return '';

        }

    }

    getProgressValue(
        value: string
    ): number {

        return Number(
            value.replace('%', '')
        ) || 0;

    }

    getProgressClass(
        value: string
    ): string {

        const percentual =
            Number(
                value.replace('%', '')
            ) || 0;

        if (percentual <= 25) {
            return 'progress-danger';
        }

        if (percentual <= 50) {
            return 'progress-warning';
        }

        return 'progress-success';

    }
}