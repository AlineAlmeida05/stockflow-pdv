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
    columns: TableColumn[] = [];

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

    @Output()
    toggle = new EventEmitter<unknown>();

    @Input()
    actionsHeader = 'Ações';

    @Input()
    clickableRows = false;

    @Output()
    actionClick =
        new EventEmitter<{
            row: unknown;
            field: string;
        }>();

    @Output()
    increment = new EventEmitter<unknown>();

    @Output()
    decrement = new EventEmitter<unknown>();

    formatCurrency(
        value: unknown
    ): string {

        const numberValue = Number(value);

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
    ):
        | 'status-success'
        | 'status-warning'
        | 'status-danger'
        | '' {

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

            case '✅ Promoção Ativa':
                return 'status-success';

            case '⚠️ Promoção':
                return 'status-warning';

            case '📈 Acompanhar':
                return 'status-success';

            case '➕ Repor':
                return 'status-danger';

            default:
                return '';

        }

    }

    getProgressValue(
        value: string
    ): number {

        return this.obterPercentual(
            value
        );

    }

    getProgressClass(
        value: string
    ):
        | 'progress-success'
        | 'progress-warning'
        | 'progress-danger' {

        const percentual = this.obterPercentual(
            value
        );

        if (percentual <= 25) {
            return 'progress-danger';
        }

        if (percentual <= 50) {
            return 'progress-warning';
        }

        return 'progress-success';

    }

    private obterPercentual(
        value: string
    ): number {

        return Number(
            value.replace('%', '')
        ) || 0;

    }

    getValue(
        row: unknown,
        field: string
    ): unknown {

        return (row as Record<string, unknown>)[field];

    }

    isInativo(
        row: unknown
    ): boolean {

        return (row as Record<string, unknown>)['ativo'] === false;

    }

    isEstoqueCritico(
        row: unknown
    ): boolean {

        const status = (row as Record<string, unknown>)['statusEstoque'];

        return (
            status === 'Crítico'
            ||
            status === 'Sem Estoque'
        );

    }

    possuiPromocao(
        row: unknown
    ): boolean {

        const preco =
            Number(
                (row as Record<string, unknown>)['precoPromocional']
            );

        return preco > 0;

    }

    temPrecoPromocional(
        row: unknown
    ): boolean {

        return Number(
            (row as Record<string, unknown>)['precoPromocional']
        ) > 0;

    }

    getNumberValue(
        row: unknown,
        field: string
    ): number {

        return Number(
            (row as Record<string, unknown>)[field]
        );

    }

    getStringValue(
        row: unknown,
        field: string
    ): string {

        return String(
            (row as Record<string, unknown>)[field] ?? ''
        );

    }

}