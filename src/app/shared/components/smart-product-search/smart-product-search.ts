import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Produto } from "../../../core/models/produto.model";



@Component({
    selector: 'app-smart-product-search',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl:
        './smart-product-search.html',
    styleUrl:
        './smart-product-search.scss'
})
export class SmartProductSearch {

    @Input()
    produtos: Produto[] = [];

    @Output()
    produtoSelecionado =
        new EventEmitter<Produto>();

    @ViewChild('produtoInput')
    produtoInput?: ElementRef<HTMLInputElement>;


    textoBusca = '';

    mostrarResultados = false;

    get resultados(): Produto[] {

        const busca =
            this.textoBusca
                .trim()
                .toLowerCase();

        if (!busca) {

            return [];

        }

        return this.produtos
            .filter(
                produto =>

                    produto.nome
                        ?.toLowerCase()
                        .includes(busca)

                    ||

                    produto.codigo
                        ?.toLowerCase()
                        .includes(busca)

                    ||

                    produto.codigoBarras
                        ?.toLowerCase()
                        .includes(busca)

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

        this.textoBusca =
            produto.nome;

        this.mostrarResultados =
            false;

        this.produtoSelecionado.emit(
            produto
        );

    }

    buscar(): void {

        this.mostrarResultados =
            true;

        const busca =
            this.textoBusca.trim();

        if (!busca) {

            this.mostrarResultados =
                false;

            return;

        }

        if (

            this.resultados.length === 1

        ) {

            const produto =
                this.resultados[0];

            if (

                produto.codigo === busca

                ||

                produto.codigoBarras === busca

            ) {

                this.selecionarProduto(
                    produto
                );

            }

        }

    }

    focar(): void {

        this.produtoInput
            ?.nativeElement
            .focus();

        this.produtoInput
            ?.nativeElement
            .select();

    }

    limpar(): void {

        this.textoBusca = '';

        this.mostrarResultados = false;

    }

    setProduto(
        produto: Produto | undefined
    ): void {

        this.textoBusca =
            produto?.nome ?? '';

        this.mostrarResultados = false;

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