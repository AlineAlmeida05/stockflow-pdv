import { Component, OnInit } from '@angular/core';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { DataTable } from '../../shared/components/data-table/data-table';

@Component({
    selector: 'app-estoque',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        SearchInput,
        EmptyState,
        DataTable
    ],
    templateUrl: './estoque.html',
    styleUrl: './estoque.scss'
})
export class Estoque implements OnInit {

    produtos: Produto[] = [];

    textoBusca = '';

    colunasEstoque: {
        field: string;
        header: string;
        type?: 'text' | 'badge';
    }[] = [
            {
                field: 'nome',
                header: 'Produto',
                type: 'text'
            },
            {
                field: 'categoria',
                header: 'Categoria',
            },
            {
                field: 'estoqueAtual',
                header: 'Estoque Atual'
            },
            {
                field: 'estoqueMinimo',
                header: 'Estoque Mínimo'
            },
            {
                field: 'statusEstoque',
                header: 'Status',
                type: 'badge'
            }
        ];

    constructor(
        private produtoService: ProdutoService
    ) { }

    ngOnInit(): void {
        this.carregarProdutos();
    }

    carregarProdutos(): void {
        this.produtos =
            this.produtoService.listar();
    }

    get produtosEstoque(): unknown[] {

        return this.produtosFiltrados.map(
            produto => ({

                ...produto,

                statusEstoque:
                    produto.estoqueAtual <=

                        produto.estoqueMinimo
                        ? 'Estoque Baixo'

                        : produto.estoqueAtual <=
                            produto.estoqueMinimo * 2

                            ? 'Atenção'
                            : 'Em Estoque'
            
            })
        );

    }

    get produtosFiltrados(): Produto[] {

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

}