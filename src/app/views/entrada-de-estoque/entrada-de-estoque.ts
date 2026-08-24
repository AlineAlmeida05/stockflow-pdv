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

import { SelectInput } from '../../shared/components/select-input/select-input';
import { ProductSearch } from '../../shared/components/product-search/product-search';
import { AlertService } from '../../core/services/alert.service';

import { StatCard } from '../../shared/components/stat-card/stat-card';
import { ExpandableCard } from '../../shared/components/expandable-card/expandable-card';
import { ViewChild } from '@angular/core';

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
        CurrencyInput,
        SelectInput,
        ProductSearch,
        StatCard,
        ExpandableCard
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
        align: 'left' | 'right' | "center"
    }[] = [
            {
                field: 'nome',
                header: 'Produto',
                align: 'left'
            },
            {
                field: 'estoqueAtual',
                header: 'Atual',
                align: 'right'
            },
            {

                field: 'estoqueMinimo',
                header: 'Mínimo',
                align: 'right'
            },
            {
                field: 'nivelEstoque',
                header: 'Nível',
                align: 'right'
            },
            {
                field: 'statusEstoque',
                header: 'Status',
                type: 'badge',
                align: 'center'
            }
        ];

    colunasMovimentacoes: {
        field: string;
        header: string;
        type?: 'text' | 'badge';
        align?: 'left' | 'right' | 'center';
    }[] = [
            {
                field: 'produtoNome',
                header: 'Produto',
                align: 'left'
            },
            {
                field: 'quantidade',
                header: 'Qtde',
                align: 'right'
            },
            {
                field: 'precoCompraFormatado',
                header: 'Preço',
                align: 'right'
            },
            {
                field: 'dataFormatada',
                header: 'Data',
                align: 'left'
            }
        ];

    @ViewChild(ProductSearch)
    productSearch?: ProductSearch;

    constructor(
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.carregarProdutos();
    }

    carregarProdutos(): void {

        this.produtos =
            this.produtoService.listar();

    }

    adicionarEstoque(): void {

        if (!this.produtoSelecionadoId) {

            this.alertService.warning(
                'Selecione um produto.'
            );

            return;

        }

        const quantidade =

            this.quantidade ?? 0;

        if (
            !this.quantidade ||
            this.quantidade <= 0
        ) {

            this.alertService.warning(
                'Informe uma quantidade válida.'
            );

            return;

        }

        const precoCompra =

            this.precoCompra ?? 0;

        if (
            !this.precoCompra ||
            this.precoCompra <= 0
        ) {

            this.alertService.warning(
                'Informe o preço de compra.'
            );

            return;

        }

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

        this.alertService.success(
            'Estoque adicionado com sucesso.'
        );

        this.produtoSelecionadoId = '';

        this.quantidade = null;

        this.precoCompra = null;

        this.productSearch?.limpar();

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

                        ? 'Baixo'

                        : produto.estoqueAtual <=
                            produto.estoqueMinimo * 2

                            ? 'Atenção'

                            : 'Em Estoque',

                nivelEstoque:
                    produto.estoqueMinimo === 0
                        ? '100%'
                        : Math.round(
                            (
                                produto.estoqueAtual /
                                produto.estoqueMinimo
                            ) * 100
                        ) + '%',

            })

        );


    }

    get produtoOptions() {

        return [

            {
                value: '',
                label: 'Selecione um produto'
            },

            ...this.produtos.map(
                produto => ({
                    value: produto.id,
                    label: produto.nome
                })
            )

        ];

    }

    selecionarProduto(
        produto: Produto
    ): void {

        this.produtoSelecionadoId =
            produto.id;

    }

    obterNomeProdutoSelecionado(): string {

        return this.produtos.find(
            p => p.id === this.produtoSelecionadoId
        )?.nome ?? '';

    }

    get totalProdutos(): number {

        return this.produtosFiltrados.length;

    }


    get totalNormal(): number {

        return this.produtosFiltrados.filter(
            produto =>
                produto.estoqueAtual >
                produto.estoqueMinimo * 2
        ).length;

    }

    get totalAtencao(): number {

        return this.produtosFiltrados.filter(
            produto =>
                produto.estoqueAtual >
                produto.estoqueMinimo &&
                produto.estoqueAtual <=
                produto.estoqueMinimo * 2
        ).length;

    }

    get totalCritico(): number {

        return this.produtosFiltrados.filter(
            produto =>
                produto.estoqueAtual <=
                produto.estoqueMinimo
        ).length;

    }

    get movimentacoesRecentes(): unknown[] {

        return this.movimentacaoService
            .listar()
            .filter(
                mov => mov.tipo === 'entrada'
            )
            .slice()
            .reverse()
            .slice(0, 10)
            .map(
                mov => ({

                    ...mov,

                    precoCompraFormatado:
                        mov.precoCompra
                            ? `R$ ${mov.precoCompra.toFixed(2)}`
                            : '-',

                    dataFormatada:
                        new Date(
                            mov.dataMovimentacao
                        ).toLocaleDateString(
                            'pt-BR'
                        )

                })
            );

    }
}