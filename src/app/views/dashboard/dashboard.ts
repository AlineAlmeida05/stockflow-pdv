import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
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
import { JsonPipe } from '@angular/common';

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
        JsonPipe
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
        | 'usuarios'
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
        periodo:
            'hoje'
            | '7dias'
            | '30dias'
            | 'mes'
            | 'todos'
    ) {

        this.periodoSelecionado =
            periodo;

        this.carregarDashboard();

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

    get cardsGeral() {

        return this.cardsDashboard;

    }

    get cardsVendas() {

        return [

            {
                title: `Vendas (${this.descricaoPeriodo})`,
                value: this.dashboard?.totalVendas ?? 0,
                variant: 'info' as const
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
                variant: 'success' as const
            },

            {
                title: 'Vendas Hoje',
                value: this.totalVendasHoje,
                variant: 'info' as const
            }

        ];

    }

    get cardsEstoque() {

        return [

            {
                title: 'Produtos',
                value: this.dashboard?.totalProdutos ?? 0,
                variant: 'info' as const
            },

            {
                title: 'Estoque Baixo',
                value: this.dashboard?.produtosComEstoqueBaixo ?? 0,
                variant: 'warning' as const
            },

            {
                title: 'Sem Estoque',
                value: this.dashboard?.produtosSemEstoque ?? 0,
                variant: 'danger' as const
            }

        ];

    }

    get cardsFinanceiro() {

        return [

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
                variant: 'warning' as const
            },

            {
                title: 'Clientes Devedores',
                value: this.dashboard?.clientesDevedores ?? 0,
                variant: 'danger' as const
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
                variant: 'success' as const
            }

        ];

    }

    get cardsPromocoes() {

        return [

            {
                title: 'Promoções Ativas',
                value: this.dashboard?.promocoesAtivas ?? 0,
                variant: 'info' as const
            },

            {
                title: 'Vendas Promocionais',
                value: this.totalVendasPromocionais,
                variant: 'success' as const
            },

            {
                title: 'Promoções Eficientes',
                value: this.totalPromocoesEficientes,
                variant: 'success' as const
            }

        ];

    }

    get cardsProdutos() {

        const produtosAtivos =
            this.produtos.filter(
                produto => produto.ativo
            ).length;

        const produtosInativos =
            this.produtos.filter(
                produto => !produto.ativo
            ).length;

        return [

            {
                title: 'Produtos',
                value: this.produtos.length,
                variant: 'info' as const
            },

            {
                title: 'Ativos',
                value: produtosAtivos,
                variant: 'success' as const
            },

            {
                title: 'Inativos',
                value: produtosInativos,
                variant: 'warning' as const
            }

        ];

    }

    get cardsUsuarios() {

        return [

            {
                title: 'Usuários',
                value: 0,
                variant: 'info' as const
            },

            {
                title: 'Acessos Hoje',
                value: 0,
                variant: 'success' as const
            },

            {
                title: 'Vendas por Usuário',
                value: '-',
                variant: 'warning' as const
            }

        ];

    }

    get cardsAtuais() {

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

            case 'usuarios':

                return this.cardsUsuarios;

            default:

                return this.cardsGeral;

        }

    }

    get cardsDashboard(): {
        title: string;
        value: string | number;
        variant:
        | 'info'
        | 'success'
        | 'warning'
        | 'danger';
    }[] {

        return [

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

    get vendasFiltradas(): Venda[] {

        const hoje = new Date();

        switch (
        this.periodoSelecionado
        ) {

            case 'hoje':

                return this.vendas.filter(
                    venda =>
                        new Date(
                            venda.dataVenda
                        ).toDateString()
                        === hoje.toDateString()
                );

            case '7dias':

                const seteDias =
                    new Date();

                seteDias.setDate(
                    seteDias.getDate() - 7
                );

                return this.vendas.filter(
                    venda =>
                        new Date(
                            venda.dataVenda
                        ) >= seteDias
                );

            case '30dias':

                const trintaDias =
                    new Date();

                trintaDias.setDate(
                    trintaDias.getDate() - 30
                );

                return this.vendas.filter(
                    venda =>
                        new Date(
                            venda.dataVenda
                        ) >= trintaDias
                );

            case 'mes':

                return this.vendas.filter(
                    venda => {

                        const data =
                            new Date(
                                venda.dataVenda
                            );

                        return (
                            data.getMonth()
                            === hoje.getMonth()
                            &&
                            data.getFullYear()
                            === hoje.getFullYear()
                        );

                    }
                );

            default:

                return this.vendas;

        }

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

    private carregarDashboard() {

        this.dashboardService
            .obterDashboard(
                this.periodoSelecionado
            )
            .subscribe({

                next: dashboard => {

                    this.dashboard =
                        dashboard;

                }

            });

    }

}