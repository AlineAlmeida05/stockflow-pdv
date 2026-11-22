import { Component, Input } from '@angular/core';
import { SplitPanel } from '../../../../shared/components/split-panel/split-panel';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Produto } from '../../../../core/models/produto.model';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-report-delivery-catalogo',
    standalone: true,
    imports: [
        SplitPanel,
        EmptyState,
        CurrencyPipe
    ],
    templateUrl: './report-delivery-catalogo.html',
    styleUrl: './report-delivery-catalogo.scss'
})
export class ReportDeliveryCatalogo {

    @Input()
    totalProdutos = 0;

    @Input()
    produtosSemEstoque: any[] = [];

    @Input()
    produtosSemGiro: any[] = [];

    @Input()
    produtosPromocionais: any[] = [];

    @Input()
    produtosMaisVendidos: any[] = [];

    @Input()
    produtos: Produto[] = [];

    @Input()
    produtosEstoqueBaixo: Produto[] = [];

    selectedSection:
        | 'todos'
        | 'semEstoque'
        | 'estoqueBaixo'
        | 'promocoes'
        | null
        = null;


    selecionarResumo(
        resumo:
            | 'todos'
            | 'semEstoque'
            | 'estoqueBaixo'
            | 'promocoes'
    ): void {

        this.selectedSection = resumo;

    }

    get tituloDetalhe(): string {
        switch (this.selectedSection) {
            case 'todos':
                return '📦 Todos os Produtos';

            case 'estoqueBaixo':
                return '⚠️ Estoque Baixo';

            case 'semEstoque':
                return '❌ Sem Estoque';

            case 'promocoes':
                return '🏷 Produtos Promocionais';

            default:
                return '';
        }
    }

    get valorPrincipal(): string {
        switch (this.selectedSection) {

            case 'todos':
                return String(this.produtos.length);

            case 'estoqueBaixo':
                return String(this.produtosEstoqueBaixo.length);

            case 'semEstoque':
                return String(this.produtosSemEstoque.length);

            case 'promocoes':
                return String(this.produtosPromocionais.length);

            default:
                return '-';
        }
    }

}