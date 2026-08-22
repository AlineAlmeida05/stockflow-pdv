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
        type?: 'text' | 'badge';
    }[] = [];

    @Input()
    data: unknown[] = [];

    @Input()
    showActions = false;

    @Output()
    edit =
        new EventEmitter<unknown>();

    @Output()
    delete =
        new EventEmitter<unknown>();

    obterVariantStatus(
        status: string
    ): 'success' | 'warning' | 'danger' {

        switch (status) {

            case 'Estoque Baixo':
                return 'danger';

            case 'Atenção':
                return 'warning';

            default:
                return 'success';

        }

    }
}