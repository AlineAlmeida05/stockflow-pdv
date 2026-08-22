import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatCard } from '../../../../shared/components/stat-card/stat-card';

import { DataTable } from '../../../../shared/components/data-table/data-table';

import { ReportLayout } from '../../../../shared/components/report-layout/report-layout';
import { StatCardCarousel } from '../../../../shared/components/stat-card-carousel/stat-card-carousel';

@Component({
    selector: 'app-report-vendas',
    standalone: true,

    imports: [
        CurrencyPipe,
        FormsModule,
        StatCard,
        DataTable,
        StatCardCarousel,
        ReportLayout
    ],

    templateUrl: './report-vendas.html',
    styleUrl: './report-vendas.scss'
})

export class ReportVendas {

    @Input()
    totalVendas = 0;

    @Input()
    faturamentoTotal = 0;

    @Input()
    ticketMedio = 0;

    @Input()
    formaPagamentoMaisUtilizada = '';

    @Input()
    topProdutosVendidos: any[] = [];

    @Input()
    produtoMaisFaturou: any;

    @Input()
    melhorDiaData = '';

    @Input()
    melhorDiaValor = '';

    @Input()
    evolucaoVendasPorDia: any[] = [];

    @Input()
    vendasTabela: any[] = [];

    @Input()
    colunasVendas: any[] = [];

    @Input()
    faturamentoPorPagamento: any[] = [];

    @Input()
    periodoSelecionado = 'todos';

    @Input()
    formaPagamentoSelecionada = 'todos';

    @Output()
    periodoSelecionadoChange =
        new EventEmitter<string>();

    @Output()
    formaPagamentoSelecionadaChange =
        new EventEmitter<string>();

    get cardsVendas(): {
        title: string;
        value: string | number;
        variant: 'info' | 'success' | 'warning' | 'danger';
    }[] {

        return [

            {
                title: 'Total de Vendas',
                value: this.totalVendas,
                variant: 'info'
            },
            {
                title: 'Faturamento',
                value: this.faturamentoTotal.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                ),
                variant: 'success'
            },
            {
                title: 'Ticket Médio',
                value: this.ticketMedio.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                ),
                variant: 'warning'
            },
            {
                title: 'Forma Mais Utilizada',
                value: this.formaPagamentoMaisUtilizada,
                variant: 'info'
            }
        ];
    }
}


