import { Component, Input } from '@angular/core';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { SplitPanel } from '../../../../shared/components/split-panel/split-panel';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SelectInput } from '../../../../shared/components/select-input/select-input';
@Component({
    selector: 'app-report-estoque',
    standalone: true,
    imports: [
        StatCard,
        SplitPanel,
        EmptyState,
        DataTable,
        SelectInput
    ],
    templateUrl: './report-estoque.html',
    styleUrl: './report-estoque.scss'
})

export class ReportEstoque {
    @Input()
    totalProdutos = 0;

    @Input()
    produtosSemEstoque: any[] = [];

    @Input()
    produtosEstoqueBaixo: any[] = [];

    @Input()
    produtosReposicao: any[] = [];

    @Input()
    produtosSemMovimentacao: any[] = [];

    @Input()
    sugestoesReposicao: any[] = [];

    @Input()
    produtosMenorGiro: any[] = [];

    @Input()
    produtosMaiorGiro: any[] = [];

    @Input()
    colunasEstoque: any[] = [];

    @Input()
    produtosTabela: any[] = [];

    @Input()
    colunasGiroEstoque: any[] = [];

    @Input()
    produtosGiroEstoque: any[] = [];

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

    get cardsEstoque(): {
        id: string;
        title: string;
        value: number;
        variant: 'info' | 'warning' | 'danger' | 'success';
    }[] {
        return [

            {
                id: 'estoque-atual',
                title: 'Produtos',
                value: this.totalProdutos,
                variant: 'info'
            },

            {
                id: 'sem-estoque',
                title: 'Sem Estoque',
                value: this.produtosSemEstoque.length,
                variant: 'danger' as const
            },

            {
                id: 'estoque-baixo',
                title: 'Baixo',
                value: this.produtosEstoqueBaixo.length,
                variant: 'warning' as const
            },
            {
                id: 'reposicao',
                title: 'Reposição',
                value: this.produtosReposicao.length,
                variant: 'danger' as const
            }
        ];
    }

    selecionarCard(id: string): void {

        this.selectedSection = id;

    }

    get produtosTabelaPaginada() {

        const inicio =
            (this.paginaAtual - 1)
            * Number(this.itensPorPagina);

        const fim =
            inicio + Number(this.itensPorPagina);

        return this.produtosTabela.slice(
            inicio,
            fim
        );

    }

    get totalPaginas() {

        return Math.max(
            1,
            Math.ceil(
                this.produtosTabela.length
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

        return this.produtosTabela.length === 0
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

            this.produtosTabela.length

        );

    }

}