import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { SplitPanel } from '../../../../shared/components/split-panel/split-panel';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SelectInput } from '../../../../shared/components/select-input/select-input';
@Component({
    selector: 'app-report-vendas',
    standalone: true,

    imports: [
        CurrencyPipe,
        FormsModule,
        DataTable,
        StatCard,
        SplitPanel,
        EmptyState,
        SelectInput
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
    formaPagamentoSelecionada = 'todos';

    @Output()
    formaPagamentoSelecionadaChange = new EventEmitter<string>();

    selectedSection: string | null = null;

    paginaAtual = 1;

    itensPorPagina = '10';

    opcoesItensPorPagina = [
        {
            label: '10 por página',
            value: '10'
        },
        {
            label: '25 por página',
            value: '25'
        },
        {
            label: '50 por página',
            value: '50'
        },
        {
            label: '100 por página',
            value: '100'
        }
    ];

    get cardsVendas(): {
        id: string;
        title: string;
        value: string | number;
        variant: 'info' | 'success' | 'warning' | 'danger';
    }[] {
        return [
            {
                id: 'historico-vendas',
                title: 'Total de Vendas',
                value: this.totalVendas,
                variant: 'info'
            },
            {
                id: 'faturamento',
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
                id: 'ticket-medio',
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
                id: 'forma-pagamento',
                title: 'Forma Mais Utilizada',
                value: this.formaPagamentoMaisUtilizada,
                variant: 'info'
            }
        ];

    }

    selecionarCard(id: string): void {

        this.selectedSection = id;

    }

    get vendasTabelaPaginada() {

        const inicio =
            (this.paginaAtual - 1)
            * Number(this.itensPorPagina);

        const fim =
            inicio + Number(this.itensPorPagina);

        return this.vendasTabela.slice(
            inicio,
            fim
        );

    }

    get totalPaginas() {

        return Math.max(
            1,
            Math.ceil(
                this.vendasTabela.length
                /
                Number(this.itensPorPagina)
            )
        );

    }

    proximaPagina(): void {

        if (
            this.paginaAtual <
            this.totalPaginas
        ) {

            this.paginaAtual++;

        }

    }

    paginaAnterior(): void {

        if (
            this.paginaAtual > 1
        ) {

            this.paginaAtual--;

        }

    }

    alterarItensPorPagina(): void {

        this.paginaAtual = 1;

    }

    get inicioPagina(): number {

        return this.vendasTabela.length === 0
            ? 0
            : (
                (this.paginaAtual - 1)
                * Number(this.itensPorPagina)
            ) + 1;

    }

    get fimPagina(): number {

        return Math.min(
            this.paginaAtual
            * Number(this.itensPorPagina),

            this.vendasTabela.length
        );

    }
}


