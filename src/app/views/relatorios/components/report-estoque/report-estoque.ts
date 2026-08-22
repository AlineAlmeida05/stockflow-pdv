import { Component, Input } from '@angular/core';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { StatCardCarousel } from '../../../../shared/components/stat-card-carousel/stat-card-carousel';
import { ReportLayout } from '../../../../shared/components/report-layout/report-layout';
import { DataTable } from '../../../../shared/components/data-table/data-table';

@Component({
    selector: 'app-report-estoque',
    standalone: true,
    imports: [
        StatCard,
        StatCardCarousel,
        ReportLayout,
        DataTable
    ],
    templateUrl: './report-estoque.html'
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

    get cardsEstoque(): {

        title: string;
        value: number;
        variant: 'info' | 'warning' | 'danger' | 'success';
    }[] {
        return [

            {
                title: 'Produtos',
                value: this.totalProdutos,
                variant: 'info' as const
            },

            {
                title: 'Sem Estoque',
                value: this.produtosSemEstoque.length,
                variant: 'danger' as const
            },

            {
                title: 'Estoque Baixo',
                value: this.produtosEstoqueBaixo.length,
                variant: 'warning' as const
            },
            {
                title: 'Reposição',
                value: this.produtosReposicao.length,
                variant: 'danger' as const
            }
        ];
    }


}