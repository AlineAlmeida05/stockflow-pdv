import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Produto } from "../../../core/models/produto.model";
import { ChangeDetectorRef } from '@angular/core';


@Component({
    selector: 'app-smart-product-search',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './smart-product-search.html',
    styleUrl: './smart-product-search.scss'
})
export class SmartProductSearch {

    @Input()
    produtos: Produto[] = [];

    @Output()
    produtoSelecionado = new EventEmitter<Produto>();

    @ViewChild('produtoInput')
    produtoInput?: ElementRef<HTMLInputElement>;

    resultados: Produto[] = [];

    readonly inputId = `produto-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

    textoBusca = '';

    mostrarResultados = false;

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    private atualizarResultados(): void {

        const busca =
            this.textoBusca
                .trim()
                .toLowerCase();

        if (!busca) {
            this.resultados = [];
            return;
        }

        this.resultados =
            this.produtos
                .filter(produto => produto.ativo)
                .filter(
                    produto =>
                        produto.nome?.toLowerCase()
                            .includes(busca)
                        ||
                        produto.codigo?.toLowerCase()
                            .includes(busca)
                        ||
                        produto.codigoBarras?.toLowerCase()
                            .includes(busca)
                )
                .sort((a, b) =>
                    a.nome.localeCompare(
                        b.nome,
                        'pt-BR'
                    )
                )
                .slice(0, 10);

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

    buscar(): void {

        this.mostrarResultados = true;

        const busca = this.textoBusca.trim();

        this.atualizarResultados();

        if (!busca) {

            this.mostrarResultados = false;

            return;

        }

        if (

            this.resultados.length === 1

        ) {

            const produto = this.resultados[0];

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

        const input = this.produtoInput?.nativeElement;

        input?.focus();
        input?.select();

    }

    limpar(): void {

        this.textoBusca = '';

        this.mostrarResultados = false;

        this.cdr.detectChanges();

    }

    setProduto(
        produto: Produto | undefined
    ): void {

        this.textoBusca = produto?.nome ?? '';

        this.resultados = [];

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

    fecharResultados(): void {

        setTimeout(() => {

            this.mostrarResultados = false;

        }, 150);

    }

}