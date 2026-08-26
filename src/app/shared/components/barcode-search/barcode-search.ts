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
    selector: 'app-barcode-search',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './barcode-search.html',
    styleUrl: './barcode-search.scss'
})
export class BarcodeSearch {
    @Input()
    produtos: Produto[] = [];

    @Output()
    produtoSelecionado =
        new EventEmitter<Produto>();

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    codigoBarras = '';

    mostrarResultados = false;

    get resultados(): Produto[] {

        const busca =
            this.codigoBarras.trim();

        if (!busca) {

            return [];

        }

        return this.produtos
            .filter(
                produto =>
                    produto.codigoBarras
                        ?.includes(busca)
            )
            .sort((a, b) =>
                a.codigoBarras.localeCompare(
                    b.codigoBarras
                )
            );

    }

    buscar(): void {

        this.mostrarResultados =
            true;

        if (
            this.codigoBarras.trim() === ''
        ) {

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
                produto.codigoBarras ===
                this.codigoBarras.trim()
            ) {

                this.selecionar(produto);

            }

        }

    }

    selecionar(
        produto: Produto
    ): void {

        this.codigoBarras =
            produto.codigoBarras ?? '';

        this.mostrarResultados =
            false;

        this.produtoSelecionado.emit(
            produto
        );

    }

    limpar(): void {

        this.codigoBarras = '';

        this.mostrarResultados = false;

        this.cdr.detectChanges();

    }

    setProduto(
        produto: Produto | undefined
    ): void {

        this.codigoBarras = produto?.codigoBarras ?? '';

        this.mostrarResultados = false;

        this.cdr.detectChanges();

    }
}