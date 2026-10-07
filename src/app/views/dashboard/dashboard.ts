import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { VendaService } from '../../core/services/venda.service';
import { FiadoService } from '../../core/services/fiado.service';
import { ProdutoService } from '../../core/services/produto.service';
import { Venda } from '../../core/models/venda.model';
import { Fiado } from '../../core/models/fiado.model';
import { Produto } from '../../core/models/produto.model';
import { MovimentacaoEstoque } from '../../core/models/movimentacao-estoque.model';
import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { StatCardCarousel } from '../../shared/components/stat-card-carousel/stat-card-carousel';
import { DashboardLayout } from '../../shared/components/dashboard-layout/dashboard-layout';
import { DashboardChart } from '../../shared/components/dashboard-chart/dashboard-chart';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse } from '../../core/models/dashboard-response.model';
import { EmptyState } from '../../shared/components/empty-state/empty-state';


type CardVariant =
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';

interface DashboardCard {
    title: string;
    value: string | number;
    variant: CardVariant;
}

type PeriodoDashboard =
    | 'hoje'
    | '7dias'
    | '30dias'
    | 'mes'
    | 'todos';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        PageTitle,
        StatCardCarousel,
        DashboardLayout,
        DashboardChart,
        FormsModule,
        EmptyState,
        DatePipe
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

    vendas: Venda[] = [];

    fiados: Fiado[] = [];

    produtos: Produto[] = [];

    movimentacoes: MovimentacaoEstoque[] = [];

    dashboard?: DashboardResponse;

    resumoGeralSelecionado = '';

    resumoEstoqueSelecionado = '';

    resumoPromocoesSelecionado = '';

    resumoProdutosSelecionado = '';

    periodoSelecionado: PeriodoDashboard = 'hoje';

    abaSelecionada:
        'geral'
        | 'vendas'
        | 'estoque'
        | 'financeiro'
        | 'promocoes'
        | 'produtos'
        = 'geral';

    constructor(
        private vendaService: VendaService,
        private fiadoService: FiadoService,
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService,
        private dashboardService: DashboardService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.vendaService
            .listar()
            .subscribe({
                next: vendas => {

                    this.vendas = vendas;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }
            });

        this.fiadoService
            .listar()
            .subscribe({

                next: fiados => {

                    this.fiados = fiados;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

        this.produtoService
            .listar()
            .subscribe({

                next: produtos => {

                    this.produtos = produtos;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }

            });

        this.movimentacaoService
            .listar()
            .subscribe({

                next: movimentacoes => {

                    this.movimentacoes = movimentacoes;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }

            });

        this.carregarDashboard();

        this.cdr.detectChanges();

    }

    private criarCard(
        title: string,
        value: string | number,
        variant: CardVariant
    ): DashboardCard {

        return {
            title,
            value,
            variant
        };

    }

    private formatarMoeda(
        valor: number
    ): string {

        return valor.toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        );

    }

    private estaNoPeriodo(
        data: Date
    ): boolean {

        const hoje = new Date();

        switch (this.periodoSelecionado) {

            case 'hoje':
                return (
                    data.toDateString() ===
                    hoje.toDateString()
                );

            case '7dias':
                return (
                    hoje.getTime() -
                    data.getTime()
                ) <= 7 * 24 * 60 * 60 * 1000;

            case '30dias':
                return (
                    hoje.getTime() -
                    data.getTime()
                ) <= 30 * 24 * 60 * 60 * 1000;

            case 'mes':
                return (
                    data.getMonth() === hoje.getMonth()
                    &&
                    data.getFullYear() === hoje.getFullYear()
                );

            default:
                return true;
        }
    }

    private carregarDashboard(): void {

        this.dashboardService
            .obterDashboard(
                this.periodoSelecionado
            )
            .subscribe({

                next: dashboard => {

                    this.dashboard = dashboard;

                    this.cdr.detectChanges();

                }

            });

    }

    get totalProdutosAtivos(): number {
        return this.produtos.filter(
            produto => produto.ativo
        ).length;
    }

    get totalProdutosInativos(): number {
        return this.produtos.filter(
            produto => !produto.ativo
        ).length;
    }

    get promocoesAtivasDetalhes() {

        return this.dashboard
            ?.promocoesAtivasDetalhes
            ?? [];

    }

    get vendasHoje(): Venda[] {

        const hoje =
            new Date().toDateString();

        return this.vendas.filter(
            venda =>
                new Date(
                    venda.dataVenda
                ).toDateString() === hoje
        );

    }

    alterarPeriodo(
        periodo: PeriodoDashboard
    ) {

        this.periodoSelecionado = periodo;

        this.carregarDashboard();
        this.cdr.detectChanges();

    }

    get totalVendasHoje(): number {

        return this.vendasHoje.length;

    }

    get totalVendasPeriodo(): number {

        return this.vendasFiltradas.length;

    }

    get faturamentoPeriodo(): number {

        return this.vendasFiltradas.reduce(

            (total, venda) =>

                total + venda.valorTotal,

            0

        );

    }

    get faturamentoHoje(): number {

        return this.vendasHoje.reduce(
            (total, venda) =>
                total + venda.valorTotal,
            0
        );

    }

    get fiadosEmAberto(): number {

        return this.fiados.reduce(
            (total, fiado) =>
                total + fiado.valorTotal,
            0
        );

    }

    get clientesDevedores(): number {

        return new Set(
            this.fiados.map(
                fiado => fiado.clienteId
            )
        ).size;

    }

    get fiadosFiltrados() {
        return this.fiados.filter(
            fiado =>
                this.estaNoPeriodo(
                    new Date(fiado.dataLancamento)
                )
        );
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

    get produtosComEstoqueBaixo(): number {

        return this.produtos
            .filter(
                produto =>
                    produto.estoqueAtual <=
                    produto.estoqueMinimo
            )
            .length;

    }

    get produtosSemEstoque() {

        return this.produtos
            .filter(
                produto =>
                    produto.estoqueAtual === 0
            );

    }

    get produtosEstoqueBaixo() {

        return this.produtos
            .filter(
                produto =>
                    produto.estoqueAtual > 0 &&
                    produto.estoqueAtual <=
                    produto.estoqueMinimo
            );

    }

    get vendasPromocionais(): Venda[] {

        return this.vendas.filter(
            venda =>
                venda.status !== 'cancelada' &&
                (venda.itens ?? []).some(
                    item =>
                        item.promocaoAplicada
                )
        );

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

    get possuiIndicadoresPromocionais(): boolean {

        return (
            this.totalPromocoesAtivas > 0 ||
            this.totalVendasPromocionais > 0
        );

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

    get vendasChartData() {

        const evolucao =
            this.dashboard?.evolucaoVendas ?? [];

        return {

            labels:
                evolucao.map(
                    item => item.data
                ),

            datasets: [

                {

                    label: 'Faturamento',

                    data:
                        evolucao.map(
                            item => item.total
                        ),

                    borderColor:
                        '#2563eb',

                    backgroundColor:
                        'rgba(37,99,235,0.2)',

                    tension: 0.3,

                    fill: true

                }

            ]

        };

    }

    get vendasChartOptions() {

        return {

            responsive: true,

            maintainAspectRatio: false

        };

    }

    get cardsGeral(): DashboardCard[] {

        return this.cardsDashboard;

    }

    get cardsVendas(): DashboardCard[] {

        return [
            this.criarCard(
                `Vendas (${this.descricaoPeriodo})`,
                this.dashboard?.totalVendas ?? 0,
                'info'
            ),

            this.criarCard(
                'Faturamento',
                this.formatarMoeda(
                    this.dashboard?.faturamento ?? 0
                ),
                'success'
            ),

            this.criarCard(
                'Vendas Hoje',
                this.totalVendasHoje,
                'info'
            )
        ];

    }

    get cardsEstoque(): DashboardCard[] {

        return [
            this.criarCard(
                'Produtos',
                this.dashboard?.totalProdutos ?? 0,
                'info'
            ),

            this.criarCard(
                'Estoque Baixo',
                this.dashboard?.produtosComEstoqueBaixo ?? 0,
                'warning'
            ),

            this.criarCard(
                'Sem Estoque',
                this.dashboard?.produtosSemEstoque ?? 0,
                'danger'
            )
        ];

    }

    get cardsFinanceiro(): DashboardCard[] {

        return [

            this.criarCard(
                'Fiados em Aberto',
                this.formatarMoeda(
                    this.dashboard?.fiadosEmAberto ?? 0
                ),
                'warning'
            ),

            this.criarCard(
                'Clientes Devedores',
                this.dashboard?.clientesDevedores ?? 0,
                'danger'
            ),

            this.criarCard(
                'Faturamento',
                this.formatarMoeda(
                    this.dashboard?.faturamento ?? 0
                ),
                'success'
            )

        ];

    }

    get cardsPromocoes(): DashboardCard[] {

        return [
            this.criarCard(
                'Promoções Ativas',
                this.dashboard?.promocoesAtivas ?? 0,
                'info'
            ),

            this.criarCard(
                'Vendas Promocionais',
                this.totalVendasPromocionais,
                'success'
            ),

            this.criarCard(
                'Promoções Eficientes',
                this.totalPromocoesEficientes,
                'success'
            )
        ];

    }

    get cardsProdutos(): DashboardCard[] {

        return [
            this.criarCard(
                'Produtos',
                this.produtos.length,
                'info'
            ),

            this.criarCard(
                'Ativos',
                this.totalProdutosAtivos,
                'success'
            ),

            this.criarCard(
                'Inativos',
                this.totalProdutosInativos,
                'warning'
            )
        ];

    }

    get cardsAtuais(): DashboardCard[] {

        switch (
        this.abaSelecionada
        ) {

            case 'vendas':

                return this.cardsVendas;

            case 'estoque':

                return this.cardsEstoque;

            case 'financeiro':

                return this.cardsFinanceiro;

            case 'promocoes':

                return this.cardsPromocoes;

            case 'produtos':

                return this.cardsProdutos;

            default:

                return this.cardsGeral;

        }

    }

    get cardsDashboard(): DashboardCard[] {

        return [

            this.criarCard(
                `Vendas (${this.descricaoPeriodo})`,
                this.dashboard?.totalVendas ?? 0,
                'info'
            ),

            this.criarCard(
                'Faturamento',
                this.formatarMoeda(
                    this.dashboard?.faturamento ?? 0
                ),
                'success'
            ),

            this.criarCard(
                'Fiados em Aberto',
                this.formatarMoeda(
                    this.dashboard?.fiadosEmAberto ?? 0
                ),
                'warning'
            ),

            this.criarCard(
                'Produtos',
                this.dashboard?.totalProdutos ?? 0,
                'info'
            ),

            this.criarCard(
                'Clientes Devedores',
                this.dashboard?.clientesDevedores ?? 0,
                'danger'
            ),

            this.criarCard(
                'Baixo',
                this.dashboard?.produtosComEstoqueBaixo ?? 0,
                'warning'
            )

        ];

    }

    get pagamentoChartData() {

        const pagamentos =
            this.dashboard?.faturamentoPorPagamento ?? [];

        return {

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

    get topProdutosChartData() {

        const produtos =
            this.dashboard?.topProdutosVendidos ?? [];

        return {

            labels:
                produtos.map(
                    produto => produto.nome
                ),

            datasets: [

                {

                    label:
                        'Quantidade Vendida',

                    data:
                        produtos.map(
                            produto =>
                                produto.quantidade
                        ),

                    backgroundColor:
                        '#22c55e'

                }

            ]

        };

    }

    topProdutosChartOptions: ChartConfiguration['options'] = {

        responsive: true,

        maintainAspectRatio: false,

        indexAxis: 'y'

    };

    get fiadosChartData() {

        const evolucao =
            this.dashboard?.evolucaoFiados ?? [];

        return {

            labels:
                evolucao.map(
                    item => item.data
                ),

            datasets: [

                {

                    label: 'Fiados',

                    data:
                        evolucao.map(
                            item => item.total
                        ),

                    borderColor:
                        '#f59e0b',

                    backgroundColor:
                        'rgba(245,158,11,0.25)',

                    fill: true,

                    tension: 0.3

                }

            ]

        };

    }

    get fiadosChartOptions() {

        return {

            responsive: true,

            maintainAspectRatio: false

        };

    }

    get giroChartData() {

        const produtos =
            this.dashboard?.giroEstoque ?? [];

        return {

            labels:
                produtos.map(
                    produto => produto.nome
                ),

            datasets: [

                {

                    label: 'Giro (%)',

                    data:
                        produtos.map(
                            produto => produto.giro
                        ),

                    backgroundColor:
                        '#8b5cf6'

                }

            ]

        };

    }

    giroChartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        indexAxis: 'y' as const

    };

    get vendasFiltradas() {
        return this.vendas.filter(
            venda =>
                this.estaNoPeriodo(
                    new Date(venda.dataVenda)
                )
        );
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

}