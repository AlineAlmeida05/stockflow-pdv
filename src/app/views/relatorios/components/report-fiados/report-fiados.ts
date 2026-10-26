import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SplitPanel } from '../../../../shared/components/split-panel/split-panel';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { SelectInput } from '../../../../shared/components/select-input/select-input';
@Component({
    selector: 'app-report-fiados',
    standalone: true,

    imports: [
        CurrencyPipe,
        StatCard,
        SplitPanel,
        EmptyState,
        DataTable,
        SelectInput
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
    colunasFiados: any[] = [];

    @Input()
    fiadosTabela: any[] = [];

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

    get cardsFiados(): {
        id: string;
        title: string;
        value: string | number;
        variant: 'info' | 'success' | 'warning' | 'danger';
    }[] {

        return [

            {
                id: 'valor-aberto',
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
                id: 'pendentes',
                title: 'Pendentes',
                value: this.totalPendentes,
                variant: 'warning'
            },

            {
                id: 'pagos',
                title: 'Pagos',
                value: this.totalPagos,
                variant: 'success'
            },

            {
                id: 'clientes',
                title: 'Clientes',
                value: this.clientesDevedores,
                variant: 'danger'
            },

            {
                id: 'parciais',
                title: 'Parciais',
                value: this.totalParciais,
                variant: 'warning'
            }

        ];

    }

    selecionarCard(id: string): void {

        this.selectedSection = id;

    }

    get fiadosTabelaPaginada() {

    const inicio =
        (this.paginaAtual - 1)
        * Number(this.itensPorPagina);

    const fim =
        inicio + Number(this.itensPorPagina);

    return this.fiadosTabela.slice(
        inicio,
        fim
    );

}

get totalPaginas() {

    return Math.max(
        1,
        Math.ceil(
            this.fiadosTabela.length
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

    return this.fiadosTabela.length === 0
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

        this.fiadosTabela.length
    );

}

}