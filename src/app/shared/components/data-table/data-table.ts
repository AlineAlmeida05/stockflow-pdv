import { Component, Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { ActionIcons } from '../action-icons/action-icons';
import { EmptyState } from '../empty-state/empty-state';

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [
        ActionIcons,
        EmptyState
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
        cellClass?: string;
        cellClassFn?: (row: unknown) => string;
        toggleActiveValue?: string;
        toggleActiveLabel?: string;
        toggleInactiveLabel?: string;
        badgeClassFn?: (row: unknown) => string;
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
    rowClick = new EventEmitter<unknown>();

    @Input()
    actionsHeader = 'Ações';

    @Input()
    clickableRows = false;

    @Output()
    toggle = new EventEmitter;

    @Input()
    trackByField = 'id';

    @Input()
    emptyTitle = 'Nenhum registro encontrado';

    @Input()
    emptyMessage = 'Ajuste os filtros e tente novamente.';

    @Input()
    emptyIcon = '📋';

    @Input()
    loading = false;

    @Input()
    rowClassFn?: (row: unknown) => string;

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

    trackRow(
        index: number,
        row: Record<string, unknown>
    ): unknown {

        return (
            row[this.trackByField]
            ?? index
        );

    }
}