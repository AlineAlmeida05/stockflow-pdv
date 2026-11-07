import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { ProdutoPromocao } from '../../core/models/produto-promocao.model';
import { PromocaoService } from '../../core/services/promocao.service';
import { Router } from '@angular/router';

type ProdutoEstoque = Produto & {
    statusEstoque: string;
    nivelEstoque: string;
    acaoPromocional: string;
};
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

    filtroStatus = '';

    pendentes: ProdutoPromocao[] = [];

    ativas: ProdutoPromocao[] = [];

    colunasEstoque: {
        field: string;
        header: string;
        type?: | 'text' | 'badge' | 'currency' | 'date' | 'progress' | 'toggle' | 'action';
        align: 'left' | 'right' | 'center';
    }[] = [
            {
                field: 'nome',
                header: 'Produto',
                type: 'text',
                align: 'left'
            },
            {
                field: 'acaoPromocional',
                header: '',
                type: 'action',
                align: 'center'
            },
            {
                field: 'estoqueAtual',
                header: 'Qtde Atual',
                align: 'center'
            },
            {
                field: 'estoqueMinimo',
                header: 'Qtde Mínima',
                align: 'center'
            },
            {
                field: 'nivelEstoque',
                header: 'Nível',
                type: 'progress',
                align: 'center'
            },
            {
                field: 'statusEstoque',
                header: 'Status',
                type: 'badge',
                align: 'right'
            }
        ];

    statusOptions = [
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

    @ViewChild(SearchInput)
    searchInput?: SearchInput;

    constructor(
        private produtoService: ProdutoService,
        private promocaoService: PromocaoService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.promocaoService
            .listarPainel()
            .subscribe({
                next: painel => {

                    this.pendentes = painel.pendentes;

                    this.ativas = painel.ativas;

                    this.cdr.detectChanges();

                }
            });

        this.carregarProdutos();
    }

    carregarProdutos(): void {
        this.produtoService
            .listar()
            .subscribe({

                next: produtos => {

                    this.produtos = produtos;


                    setTimeout(() => {

                        this.searchInput?.focar();

                    });

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }

            });
    }

    get produtosEstoque(): ProdutoEstoque[] {

        return this.produtosFiltrados.map(
            produto => ({

                ...produto,

                statusEstoque:
                    this.obterDescricaoStatusEstoque(
                        produto
                    ),
                acaoPromocional:
                    this.obterAcaoProduto(
                        produto
                    ),

                nivelEstoque:
                    produto.estoqueMinimo === 0
                        ? '-'
                        : Math.min(
                            100,
                            Math.round(
                                (
                                    produto.estoqueAtual /
                                    produto.estoqueMinimo
                                ) * 100
                            )
                        ) + '%',


            })
        );

    }

    get produtosFiltrados(): Produto[] {

        return this.produtos.filter(
            produto => {

                const atendeBusca = produto.nome
                    .toLowerCase()
                    .includes(
                        this.textoBusca
                            .toLowerCase()
                    );

                if (!atendeBusca) {
                    return false;
                }

                if (!this.filtroStatus) {
                    return true;
                }

                const status = this.obterStatusEstoque(
                    produto
                );

                if (
                    this.filtroStatus === 'baixo'
                ) {

                    return (
                        status === 'baixo' ||
                        status === 'sem-estoque'
                    );

                }

                if (
                    this.filtroStatus === 'atencao'
                ) {

                    return (
                        status === 'atencao'
                    );

                }

                return (
                    status === 'normal'
                );

            }
        );

    }

    get totalProdutos(): number {

        return this.produtos.length;

    }

    get totalEmEstoque(): number {

        return this.produtos.filter(
            produto =>
                this.obterStatusEstoque(
                    produto
                ) === 'normal'
        ).length;

    }

    get totalBaixo(): number {

        return this.produtos.filter(
            produto => {

                const status = this.obterStatusEstoque(
                    produto
                );

                return (
                    status === 'baixo' ||
                    status === 'sem-estoque'
                );

            }
        ).length;

    }

    get totalAtencao(): number {

        return this.produtos.filter(
            produto =>
                this.obterStatusEstoque(
                    produto
                ) === 'atencao'
        ).length;

    }

    selecionarFiltro(
        filtro: string
    ): void {

        this.filtroStatus = filtro;

    }

    rowClassFn = (row: unknown): string => {

        const produto = row as ProdutoEstoque;

        return (
            produto.statusEstoque === 'Crítico' ||
            produto.statusEstoque === 'Sem Estoque'
        )
            ? 'table-row-critico'
            : '';

    };

    private obterStatusEstoque(
        produto: Produto
    ):
        'normal'
        | 'atencao'
        | 'baixo'
        | 'sem-estoque' {

        if (
            produto.estoqueAtual === 0
        ) {
            return 'sem-estoque';
        }

        if (
            produto.estoqueAtual <=
            produto.estoqueMinimo
        ) {
            return 'baixo';
        }

        if (
            produto.estoqueAtual <=
            produto.estoqueMinimo * 2
        ) {
            return 'atencao';
        }

        return 'normal';
    }

    private obterDescricaoStatusEstoque(
        produto: Produto
    ): string {

        switch (
        this.obterStatusEstoque(
            produto
        )
        ) {

            case 'sem-estoque':
                return 'Sem Estoque';

            case 'baixo':
                return 'Crítico';

            case 'atencao':
                return 'Atenção';

            default:
                return 'Em Estoque';

        }

    }

    private obterAcaoProduto(
        produto: Produto
    ): string {

        if (
            this.ativas.some(
                item => item.id === produto.id
            )
        ) {
            return '📈 Acompanhar';
        }

        if (
            this.pendentes.some(
                item => item.id === produto.id
            )
        ) {
            return '⚠️ Promoção';
        }

        if (
            produto.estoqueAtual === 0
            ||
            produto.estoqueAtual <=
            produto.estoqueMinimo
        ) {
            return '➕ Repor';
        }

        return '';

    }


    abrirAcaoProduto(
        event: {
            row: unknown;
            field: string;
        }
    ): void {

        const produto =
            event.row as ProdutoEstoque;

        switch (
        produto.acaoPromocional
        ) {

            case '📈 Acompanhar':

                this.router.navigate(
                    ['/promocoes'],
                    {
                        queryParams: {
                            produtoId: produto.id
                        }
                    }
                );

                break;

            case '⚠️ Promoção':

                this.router.navigate(
                    ['/promocoes'],
                    {
                        queryParams: {
                            produtoId: produto.id
                        }
                    }
                );

                break;

            case '➕ Repor':

                this.router.navigate(
                    ['/entrada-de-estoque'],
                    {
                        queryParams: {
                            produtoId: produto.id
                        }
                    }
                );

                break;

        }

    }

}