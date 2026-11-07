import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { ProdutoService } from '../../core/services/produto.service';
import { Produto } from '../../core/models/produto.model';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { StatCardCarousel } from '../../shared/components/stat-card-carousel/stat-card-carousel';
import { DashboardLayout } from '../../shared/components/dashboard-layout/dashboard-layout';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse } from '../../core/models/dashboard-response.model';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { DashboardVendas } from './components/dashboard-vendas/dashboard-vendas';
import { DashboardFinanceiro } from './components/dashboard-financeiro/dashboard-financeiro';
import { DashboardPromocoes } from './components/dashboard-promocoes/dashboard-promocoes';
import { DashboardEstoque } from './components/dashboard-estoque/dashboard-estoque';
import { DashboardProdutos } from './components/dashboard-produtos/dashboard-produtos';
import { DashboardPanel } from '../../shared/components/dashboard-panel/dashboard-panel';

type DashboardCard = {
    title: string;
    value: string | number;
    variant:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
};

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        PageTitle,
        StatCardCarousel,
        DashboardLayout,
        EmptyState,
        DatePipe,
        DashboardVendas,
        DashboardFinanceiro,
        DashboardPromocoes,
        DashboardEstoque,
        DashboardProdutos,
        DashboardPanel
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})

export class Dashboard implements OnInit {

    produtos: Produto[] = [];

    dashboard?: DashboardResponse;

    resumoGeralSelecionado = '';

    resumoEstoqueSelecionado = '';

    resumoPromocoesSelecionado = '';

    resumoProdutosSelecionado = '';

    cardsDashboardData: DashboardCard[] = [];

    cardsVendasData: DashboardCard[] = [];

    cardsEstoqueData: DashboardCard[] = [];

    cardsFinanceiroData: DashboardCard[] = [];

    cardsPromocoesData: DashboardCard[] = [];

    cardsProdutosData: DashboardCard[] = [];

    produtosSemEstoqueData: Produto[] = [];

    produtosEstoqueBaixoData: Produto[] = [];

    cardsAtuaisData: DashboardCard[] = [];

    vendasChartDataValue:
        ChartConfiguration<'line'>['data'] = {
            labels: [],
            datasets: []
        };

    fiadosChartDataValue:
        ChartConfiguration<'line'>['data'] = {
            labels: [],
            datasets: []
        };

    pagamentoChartDataValue:
        ChartConfiguration<'doughnut'>['data'] = {
            labels: [],
            datasets: []
        };

    giroChartDataValue:
        ChartConfiguration<'bar'>['data'] = {
            labels: [],
            datasets: []
        };

    periodoSelecionado:
        'hoje'
        | '7dias'
        | '30dias'
        | 'mes'
        | 'todos'
        = 'hoje';

    abaSelecionada:
        'geral'
        | 'vendas'
        | 'estoque'
        | 'financeiro'
        | 'promocoes'
        | 'produtos'
        = 'geral';

    constructor(
        private produtoService: ProdutoService,
        private dashboardService: DashboardService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {

        this.produtoService
            .listar()
            .subscribe({

                next: produtos => {

                    this.produtos = produtos;

                    this.atualizarProdutosDerivados();

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }

            });

        this.carregarDashboard();

    }

    private atualizarCards(): void {

        this.cardsDashboardData = [
            {
                title: `Vendas (${this.descricaoPeriodo})`,
                value: this.dashboard?.totalVendas ?? 0,
                variant: 'info'
            },
            {
                title: 'Faturamento',
                value: (this.dashboard?.faturamento ?? 0)
                    .toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    ),
                variant: 'success'
            },
            {
                title: 'Fiados em Aberto',
                value: (this.dashboard?.fiadosEmAberto ?? 0)
                    .toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    ),
                variant: 'warning'
            },
            {
                title: 'Produtos',
                value: this.dashboard?.totalProdutos ?? 0,
                variant: 'info'
            },
            {
                title: 'Clientes Devedores',
                value: this.dashboard?.clientesDevedores ?? 0,
                variant: 'danger'
            },
            {
                title: 'Baixo',
                value: this.dashboard?.produtosComEstoqueBaixo ?? 0,
                variant: 'warning'
            }
        ];

    }

    private atualizarCardsSecoes(): void {

        this.cardsVendasData = [
            {
                title: `Vendas (${this.descricaoPeriodo})`,
                value: this.dashboard?.totalVendas ?? 0,
                variant: 'info'
            },
            {
                title: 'Faturamento',
                value:
                    (this.dashboard?.faturamento ?? 0)
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        ),
                variant: 'success'
            }
        ];

        this.cardsEstoqueData = [
            {
                title: 'Produtos',
                value: this.dashboard?.totalProdutos ?? 0,
                variant: 'info'
            },
            {
                title: 'Estoque Baixo',
                value: this.dashboard?.produtosComEstoqueBaixo ?? 0,
                variant: 'warning'
            },
            {
                title: 'Sem Estoque',
                value: this.dashboard?.produtosSemEstoque ?? 0,
                variant: 'danger'
            }
        ];

        this.cardsFinanceiroData = [
            {
                title: 'Fiados em Aberto',
                value:
                    (this.dashboard?.fiadosEmAberto ?? 0)
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        ),
                variant: 'warning'
            },
            {
                title: 'Clientes Devedores',
                value: this.dashboard?.clientesDevedores ?? 0,
                variant: 'danger'
            },
            {
                title: 'Faturamento',
                value:
                    (this.dashboard?.faturamento ?? 0)
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        ),
                variant: 'success'
            }
        ];

        this.cardsPromocoesData = [
            {
                title: 'Promoções Ativas',
                value: this.dashboard?.promocoesAtivas ?? 0,
                variant: 'info'
            },
            {
                title: 'Vendas Promocionais',
                value: this.totalVendasPromocionais,
                variant: 'success'
            },
            {
                title: 'Promoções Eficientes',
                value: this.totalPromocoesEficientes,
                variant: 'success'
            }
        ];

        let produtosAtivos = 0;

        for (const produto of this.produtos) {

            if (produto.ativo) {

                produtosAtivos++;

            }

        }

        const produtosInativos =
            this.produtos.length
            - produtosAtivos;

        this.cardsProdutosData = [
            {
                title: 'Produtos',
                value: this.produtos.length,
                variant: 'info'
            },
            {
                title: 'Ativos',
                value: produtosAtivos,
                variant: 'success'
            },
            {
                title: 'Inativos',
                value: produtosInativos,
                variant: 'warning'
            }
        ];
    }

    private atualizarGraficos(): void {

        const evolucaoVendas = this.dashboard?.evolucaoVendas ?? [];

        this.vendasChartDataValue = {
            labels:
                evolucaoVendas.map(
                    item => item.data
                ),
            datasets: [
                {
                    label: 'Faturamento',
                    data:
                        evolucaoVendas.map(
                            item => item.total
                        ),
                    borderColor: '#2563eb',
                    backgroundColor:
                        'rgba(37,99,235,0.2)',
                    tension: 0.3,
                    fill: true
                }
            ]
        };

        const pagamentos = this.dashboard?.faturamentoPorPagamento ?? [];

        this.pagamentoChartDataValue = {
            labels:
                pagamentos.map(
                    item => item.formaPagamento
                ),
            datasets: [
                {
                    data:
                        pagamentos.map(
                            item => item.valor
                        ),
                    backgroundColor: [
                        '#3b82f6',
                        '#22c55e',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ]
                }
            ]
        };

        const evolucaoFiados = this.dashboard?.evolucaoFiados ?? [];

        this.fiadosChartDataValue = {
            labels:
                evolucaoFiados.map(
                    item => item.data
                ),
            datasets: [
                {
                    label: 'Fiados',
                    data:
                        evolucaoFiados.map(
                            item => item.total
                        ),
                    borderColor: '#f59e0b',
                    backgroundColor:
                        'rgba(245,158,11,0.25)',
                    fill: true,
                    tension: 0.3
                }
            ]
        };

        const giro = this.dashboard?.giroEstoque ?? [];

        this.giroChartDataValue = {
            labels:
                giro.map(
                    produto => produto.nome
                ),
            datasets: [
                {
                    label: 'Giro (%)',
                    data:
                        giro.map(
                            produto => produto.giro
                        ),
                    backgroundColor: '#8b5cf6'
                }
            ]
        };

    }

    private atualizarProdutosDerivados(): void {

        this.produtosSemEstoqueData =
            this.produtos.filter(
                produto =>
                    produto.estoqueAtual === 0
            );

        this.produtosEstoqueBaixoData =
            this.produtos.filter(
                produto =>
                    produto.estoqueAtual > 0
                    &&
                    produto.estoqueAtual <=
                    produto.estoqueMinimo
            );

    }

    private atualizarCardsAtuais(): void {

        switch (this.abaSelecionada) {

            case 'vendas':
                this.cardsAtuaisData = this.cardsVendasData;
                break;

            case 'estoque':
                this.cardsAtuaisData = this.cardsEstoqueData;
                break;

            case 'financeiro':
                this.cardsAtuaisData = this.cardsFinanceiroData;
                break;

            case 'promocoes':
                this.cardsAtuaisData = this.cardsPromocoesData;
                break;

            case 'produtos':
                this.cardsAtuaisData = this.cardsProdutosData;
                break;

            default:
                this.cardsAtuaisData = this.cardsDashboardData;
        }

    }

    private carregarDashboard() {

        this.dashboardService
            .obterDashboard(
                this.periodoSelecionado
            )
            .subscribe({

                next: dashboard => {

                    this.dashboard = dashboard;

                    this.atualizarCards();

                    this.atualizarCardsSecoes();

                    this.atualizarGraficos();

                    this.atualizarCardsAtuais();

                    this.cdr.detectChanges();

                }

            });

    }

    alterarPeriodo(
        periodo:
            'hoje'
            | '7dias'
            | '30dias'
            | 'mes'
            | 'todos'
    ) {

        this.periodoSelecionado = periodo;

        this.carregarDashboard();

    }

    formatarPagamento(
        pagamento: string
    ): string {

        switch (
        pagamento?.toLowerCase()
        ) {

            case 'pix':
                return 'PIX';

            case 'credito':
                return 'Crédito';

            case 'debito':
                return 'Débito';

            case 'dinheiro':
                return 'Dinheiro';

            case 'fiado':
                return 'Fiado';

            default:
                return pagamento;

        }

    }

    readonly vendasChartOptions = {

        responsive: true,

        maintainAspectRatio: false

    };

    selecionarAba(
        aba: typeof this.abaSelecionada
    ): void {

        this.abaSelecionada = aba;

        this.atualizarCardsAtuais();

    }

    pagamentoChartOptions: ChartConfiguration['options'] = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: 'bottom'

            }

        }

    };

    readonly fiadosChartOptions = {

        responsive: true,

        maintainAspectRatio: false

    };

    giroChartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        indexAxis: 'y' as const

    };

    get promocoesAtivasDetalhes() {

        return this.dashboard
            ?.promocoesAtivasDetalhes
            ?? [];

    }

    get faturamentoPeriodo(): number {

        return this.vendasRecentes.reduce(

            (total, venda) =>

                total + venda.valorTotal,

            0

        );

    }

    get produtosSemEstoque() {

        return this.produtosSemEstoqueData;

    }

    get produtosEstoqueBaixo() {

        return this.produtosEstoqueBaixoData;

    }

    get totalVendasPromocionais() {

        return this.dashboard
            ?.totalVendasPromocionais
            ?? 0;

    }

    get faturamentoPromocional(): number {

        return this.dashboard
            ?.faturamentoPromocional
            ?? 0;

    }

    get produtosPromocionaisMaisVendidos() {

        return this.dashboard
            ?.produtosPromocionaisMaisVendidos
            ?? [];

    }

    get totalPromocoesAtivas(): number {

        return this.dashboard
            ?.promocoesAtivas
            ?? 0;
    }

    get totalPromocoesEficientes() {

        return this.dashboard
            ?.totalPromocoesEficientes
            ?? 0;

    }

    get promocoesEficientes() {

        return this.dashboard
            ?.promocoesEficientes
            ?? [];

    }

    get promocoesBaixaEfetividade() {

        return this.dashboard
            ?.promocoesBaixaEfetividade
            ?? [];

    }

    get descricaoPeriodo(): string {
        switch (this.periodoSelecionado) {

            case 'hoje':
                return 'Hoje';

            case '7dias':
                return '7 dias';

            case '30dias':
                return '30 dias';

            case 'mes':
                return 'Mês Atual';

            default:
                return 'Todos';
        }
    }

    get vendasRecentes() {

        return this.dashboard
            ?.vendasRecentes
            ?? [];

    }

    get fiadosPendentes() {

        return this.dashboard
            ?.fiadosPendentes
            ?? [];

    }

}