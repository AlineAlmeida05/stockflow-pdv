import { Component, OnInit } from '@angular/core';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { StatCard } from '../../shared/components/stat-card/stat-card';

import { FormsModule } from '@angular/forms';
import { SelectInput } from '../../shared/components/select-input/select-input';

@Component({
    selector: 'app-estoque',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        SearchInput,
        EmptyState,
        DataTable,
        Toolbar,
        StatCard,
        FormsModule,
        SelectInput
    ],
    templateUrl: './estoque.html',
    styleUrl: './estoque.scss'
})
export class Estoque implements OnInit {

    produtos: Produto[] = [];

    textoBusca = '';

    filtroStatus = 'todos';

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
                header: 'Qtde Atual'
            },
            {
                field: 'estoqueMinimo',
                header: 'Qtde Mínima'
            },
            {
                field: 'nivelEstoque',
                header: 'Nível'
            },
            {
                field: 'statusEstoque',
                header: 'Status',
                type: 'badge'
            }
        ];

    statusOptions = [
        {
            value: 'todos',
            label: 'Todos'
        },
        {
            value: 'normal',
            label: 'Normal'
        },
        {
            value: 'atencao',
            label: 'Atenção'
        },
        {
            value: 'baixo',
            label: 'Crítico'
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

    get produtosFiltrados(): Produto[] {

        return this.produtos.filter(
            produto => {

                const atendeBusca =
                    produto.nome
                        .toLowerCase()
                        .includes(
                            this.textoBusca
                                .toLowerCase()
                        );

                if (!atendeBusca) {
                    return false;
                }

                if (
                    this.filtroStatus === 'todos'
                ) {
                    return true;
                }

                if (
                    this.filtroStatus === 'baixo'
                ) {

                    return (
                        produto.estoqueAtual <=
                        produto.estoqueMinimo
                    );

                }

                if (
                    this.filtroStatus === 'atencao'
                ) {

                    return (
                        produto.estoqueAtual >
                        produto.estoqueMinimo &&
                        produto.estoqueAtual <=
                        produto.estoqueMinimo * 2
                    );

                }

                return (
                    produto.estoqueAtual >
                    produto.estoqueMinimo * 2
                );

            }
        );

    }

    get totalProdutos(): number {

        return this.produtosFiltrados.length;

    }

    get totalEmEstoque(): number {

        return this.produtosFiltrados.filter(
            produto =>
                produto.estoqueAtual >
                produto.estoqueMinimo * 2
        ).length;

    }

    get totalBaixo(): number {

        return this.produtosFiltrados.filter(
            produto =>
                produto.estoqueAtual <=
                produto.estoqueMinimo
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

}