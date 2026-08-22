import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { StatCardCarousel }
    from '../../../../shared/components/stat-card-carousel/stat-card-carousel';

import { ReportLayout }
    from '../../../../shared/components/report-layout/report-layout';

import { DataTable }
    from '../../../../shared/components/data-table/data-table';

@Component({
    selector: 'app-report-fiados',
    standalone: true,

    imports: [
        CurrencyPipe,
        StatCardCarousel,
        ReportLayout,
        DataTable
    ],

    templateUrl: './report-fiados.html',
    styleUrl: './report-fiados.scss'
})
export class ReportFiados {

    @Input()
    valorEmAberto = 0;

    @Input()
    totalPendentes = 0;

    @Input()
    totalPagos = 0;

    @Input()
    clientesDevedores = 0;

    @Input()
    totalParciais = 0;

    @Input()
    maioresDevedores: any[] = [];

    @Input()
    maiorDevedor: any;

    @Input()
    colunasFiados: any[] = [];

    @Input()
    fiadosTabela: any[] = [];

    get cardsFiados(): {
        title: string;
        value: string | number;
        variant: 'info' | 'success' | 'warning' | 'danger';
    }[] {

        return [

            {
                title: 'Valor em Aberto',
                value: this.valorEmAberto.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                ),
                variant: 'danger'
            },

            {
                title: 'Pendentes',
                value: this.totalPendentes,
                variant: 'warning'
            },

            {
                title: 'Pagos',
                value: this.totalPagos,
                variant: 'success'
            },

            {
                title: 'Clientes',
                value: this.clientesDevedores,
                variant: 'danger'
            },

            {
                title: 'Parciais',
                value: this.totalParciais,
                variant: 'warning'
            }

        ];

    }

}