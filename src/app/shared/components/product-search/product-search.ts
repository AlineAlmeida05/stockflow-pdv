import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Produto }
    from '../../../core/models/produto.model';

@Component({
    selector: 'app-product-search',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './product-search.html',
    styleUrl: './product-search.scss'
})
export class ProductSearch {

    @Input()
    produtos: Produto[] = [];

    @Output()
    produtoSelecionado =
        new EventEmitter<Produto>();

    textoBusca = '';

    get resultados(): Produto[] {

        if (
            this.textoBusca.trim() === ''
        ) {
            return [];
        }

        return this.produtos.filter(
            produto =>
                produto.nome
                    .toLowerCase()
                    .includes(
                        this.textoBusca
                            .toLowerCase()
                    )
        );

    }

    selecionarProduto(
        produto: Produto
    ): void {

        this.textoBusca =
            produto.nome;

        this.produtoSelecionado.emit(
            produto
        );

    }

}