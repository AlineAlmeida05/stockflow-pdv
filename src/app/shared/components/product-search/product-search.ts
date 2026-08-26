import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Produto } from '../../../core/models/produto.model';
import { OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-product-search',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './product-search.html',
    styleUrl: './product-search.scss'
})
export class ProductSearch implements OnInit {

    @Input()
    produtos: Produto[] = [];

    @Output()
    produtoSelecionado = new EventEmitter<Produto>();

    ngOnInit(): void {

    }

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    textoBusca = '';

    mostrarResultados = false;


    get resultados(): Produto[] {

        const busca =
            this.textoBusca.trim();

        if (!busca) {

            return [];

        }

        return this.produtos
            .filter(
                produto =>
                    produto.nome
                        .toLowerCase()
                        .includes(
                            busca.toLowerCase()
                        )
            )
            .sort((a, b) =>
                a.nome.localeCompare(
                    b.nome,
                    'pt-BR'
                )
            );

    }

    selecionarProduto(
        produto: Produto
    ): void {

        this.textoBusca = produto.nome;

        this.mostrarResultados = false;

        this.produtoSelecionado.emit(
            produto
        );

    }

    limpar(): void {

        this.textoBusca = '';

        this.mostrarResultados = false;

    }

    setProduto(
        produto: Produto | undefined
    ): void {

        this.textoBusca = produto?.nome ?? '';

        this.mostrarResultados = false;

        this.cdr.detectChanges();

    }

    selecionarPrimeiroResultado(): void {

        if (
            this.resultados.length !== 1
        ) {

            return;

        }

        this.selecionarProduto(
            this.resultados[0]
        );

    }
}