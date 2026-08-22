import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { StatCardCarousel }
    from '../../../../shared/components/stat-card-carousel/stat-card-carousel';

import { ReportLayout }
    from '../../../../shared/components/report-layout/report-layout';

@Component({
    selector: 'app-report-financeiro',
    standalone: true,

    imports: [
        CurrencyPipe,
        StatCardCarousel,
        ReportLayout
    ],

    templateUrl: './report-financeiro.html',
    styleUrl: './report-financeiro.scss'
})
export class ReportFinanceiro {

    @Input()
    faturamentoTotal = 0;

    @Input()
    valorFiados = 0;

    @Input()
    valorEmAberto = 0;

    @Input()
    receitaRealizada = 0;

    @Input()
    ticketMedio = 0;

    @Input()
    faturamentoPorPagamento: any[] = [];

    get cardsFinanceiro(): {
        title: string;
        value: string | number;
        variant: 'info' | 'success' | 'warning' | 'danger';
    }[] {
        return [

            {
                title: 'Faturamento Total',
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
                title: 'Valor em Fiados',
                value: this.valorFiados.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                ),
                variant: 'warning'
            },

            {
                title: 'Em Aberto',
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
                title: 'Receita Realizada',
                value: this.receitaRealizada.toLocaleString(
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
                variant: 'info'
            }

        ];

    }

}
