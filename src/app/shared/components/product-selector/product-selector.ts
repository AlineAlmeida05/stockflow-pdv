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
import { BarcodeSearch } from '../barcode-search/barcode-search';
import { ProductSearch } from '../product-search/product-search';

@Component({
    selector: 'app-product-selector',
    standalone: true,
    imports: [
        FormsModule,
        BarcodeSearch,
        ProductSearch
    ],
    templateUrl: './product-selector.html',
    styleUrl: './product-selector.scss'
})
export class ProductSelector implements OnInit {

    @Input()
    produtos: Produto[] = [];

    @Output()
    produtoSelecionado = new EventEmitter<Produto>();

    @ViewChild(BarcodeSearch)
    barcodeSearch?: BarcodeSearch;

    @ViewChild(ProductSearch)
    productSearch?: ProductSearch;

    ngOnInit(): void {

    }

    constructor(
        private cdr: ChangeDetectorRef
    ) { }


    selecionarProduto(
        produto: Produto
    ): void {

        console.log('Selecionado:', produto);

        this.barcodeSearch?.setProduto(produto);

        this.productSearch?.setProduto(produto);

        this.produtoSelecionado.emit(
            produto
        );

    }

    limpar(): void {

        this.barcodeSearch
            ?.setProduto(undefined);

        this.productSearch
            ?.setProduto(undefined);

    }


}