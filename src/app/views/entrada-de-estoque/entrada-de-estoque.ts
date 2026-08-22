import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';

import { MovimentacaoEstoque } from '../../core/models/movimentacao-estoque.model';
import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { DataTable } from '../../shared/components/data-table/data-table';
import { CurrencyInput } from '../../shared/components/currency-input/currency-input';

@Component({
    selector: 'app-entrada-de-estoque',
    standalone: true,
    imports: [
        MainLayout,
        FormsModule,
        PageTitle,
        SplitPanel,
        SearchInput,
        EmptyState,
        DataTable,
        CurrencyInput
    ],
    templateUrl: './entrada-de-estoque.html',
    styleUrl: './entrada-de-estoque.scss'
})

export class EntradaDeEstoque implements OnInit {

    produtos: Produto[] = [];

    produtoSelecionadoId = '';

    quantidade: number | null = null;

    precoCompra: number | null = null;

    textoBusca = '';

    colunasProdutos: {
        field: string;
        header: string;
        type?: 'text' | 'badge';
    }[] = [

            {
                field: 'nome',
                header: 'Produto'
            },
            {
                field: 'estoqueAtual',
                header: 'Estoque Atual'
            },
            {
                field: 'statusEstoque',
                header: 'Status',
                type: 'badge'
            }
        ];

    constructor(
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService
    ) { }

    ngOnInit(): void {
        this.carregarProdutos();
    }

    carregarProdutos(): void {

        this.produtos =
            this.produtoService.listar();

    }

    adicionarEstoque(): void {

        const quantidade =

            this.quantidade ?? 0;

        const precoCompra =

            this.precoCompra ?? 0;

        const produto =
            this.produtos.find(
                p => p.id === this.produtoSelecionadoId
            );

        if (!produto) {
            return;
        }

        produto.estoqueAtual += Number(
            quantidade
        );

        this.produtoService.atualizar(
            produto
        );

        const movimentacao: MovimentacaoEstoque = {
            id: crypto.randomUUID(),

            produtoId: produto.id,

            produtoNome: produto.nome,

            tipo: 'entrada',

            quantidade: quantidade,

            precoCompra: precoCompra ?? undefined,

            dataMovimentacao:
                new Date().toISOString()
        };

        this.movimentacaoService.registrarEntrada(
            movimentacao
        );

        this.produtoSelecionadoId = '';

        this.quantidade = null;

        this.precoCompra = null;

        this.carregarProdutos();

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

    get produtosTabela(): unknown[] {

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
}