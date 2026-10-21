import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { SplitPanel } from '../../../../shared/components/split-panel/split-panel';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
    selector: 'app-report-financeiro',
    standalone: true,

    imports: [
        CurrencyPipe,
        StatCard,
        SplitPanel,
        EmptyState
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

    selectedSection: string | null = null;

    get cardsFinanceiro(): {
        id: string;
        title: string;
        value: string | number;
        variant: 'info' | 'success' | 'warning' | 'danger';
    }[] {
        return [

            {
                id: 'faturamento-total',
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
                id: 'valor-fiados',
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
                id: 'em-aberto',
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
                id: 'receita-realizada',
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
                id: 'ticket-medio',
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

    selecionarCard(id: string): void {

        this.selectedSection = id;

    }

}
