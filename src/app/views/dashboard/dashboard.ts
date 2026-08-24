import { Component, OnInit } from '@angular/core';
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
        FormsModule
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

    vendas: Venda[] = [];

    fiados: Fiado[] = [];

    produtos: Produto[] = [];

    movimentacoes: MovimentacaoEstoque[] = [];

    periodoSelecionado:
        'hoje'
        | '7dias'
        | '30dias'
        | 'mes'
        | 'todos'
        = 'hoje';



    constructor(
        private vendaService: VendaService,
        private fiadoService: FiadoService,
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService,
    ) { }

    ngOnInit(): void {

        this.vendas =
            this.vendaService.listar();

        this.fiados =
            this.fiadoService.listar();

        this.produtos =
            this.produtoService.listar();

        this.movimentacoes =
            this.movimentacaoService.listar();



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

    get vendasOntem(): Venda[] {

        const ontem = new Date();

        ontem.setDate(
            ontem.getDate() - 1
        );

        return this.vendas.filter(
            venda =>
                new Date(
                    venda.dataVenda
                ).toDateString() ===
                ontem.toDateString()
        );

    }

    get faturamentoOntem(): number {

        return this.vendasOntem.reduce(
            (total, venda) =>
                total + venda.valorTotal,
            0
        );

    }

    get totalVendasOntem(): number {

        return this.vendasOntem.length;

    }

    get ultimasVendas(): Venda[] {

        return [...this.vendas]
            .sort(
                (a, b) =>
                    new Date(b.dataVenda).getTime() -
                    new Date(a.dataVenda).getTime()
            )
            .slice(0, 5);

    }

    get ultimosFiados(): Fiado[] {

        return [...this.fiados]
            .sort(
                (a, b) =>
                    new Date(
                        b.dataLancamento
                    ).getTime() -
                    new Date(
                        a.dataLancamento
                    ).getTime()
            )
            .slice(0, 5);

    }

    get topProdutosVendidos() {

        const ranking = new Map<
            string,
            {
                nome: string;
                quantidade: number;
            }
        >();

        for (
            const venda of this.vendasFiltradas) {

            if (
                venda.status === 'cancelada'
            ) {
                continue;
            }

            for (const item of venda.itens) {

                const atual =
                    ranking.get(
                        item.produtoId
                    );

                if (atual) {

                    atual.quantidade +=
                        item.quantidade;

                } else {

                    ranking.set(
                        item.produtoId,
                        {
                            nome:
                                item.produtoNome,
                            quantidade:
                                item.quantidade
                        }
                    );

                }

            }

        }

        return [...ranking.values()]
            .sort(
                (a, b) =>
                    b.quantidade -
                    a.quantidade
            )
            .slice(0, 5);

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
                venda.itens.some(
                    item =>
                        item.promocaoAplicada
                )
        );

    }

    get totalVendasPromocionais(): number {

        return this.vendasPromocionais.length;

    }

    get faturamentoPromocional(): number {

        const total =
            this.vendas
                .filter(
                    venda =>
                        venda.status !== 'cancelada'
                )
                .flatMap(
                    venda => venda.itens
                )
                .filter(
                    item =>
                        item.promocaoAplicada
                )
                .reduce(
                    (total, item) =>
                        total + item.subtotal,
                    0
                );

        return Number(
            total.toFixed(2)
        );

    }

    get produtosPromocionaisMaisVendidos() {

        const ranking = new Map<
            string,
            {
                nome: string;
                quantidade: number;
            }
        >();

        this.vendas
            .filter(
                venda =>
                    venda.status !== 'cancelada'
            )
            .forEach(venda => {

                venda.itens
                    .filter(
                        item =>
                            item.promocaoAplicada
                    )
                    .forEach(item => {

                        const atual =
                            ranking.get(
                                item.produtoId
                            );

                        if (atual) {

                            atual.quantidade +=
                                item.quantidade;

                        } else {

                            ranking.set(
                                item.produtoId,
                                {
                                    nome:
                                        item.produtoNome,
                                    quantidade:
                                        item.quantidade
                                }
                            );

                        }

                    });

            });

        return [...ranking.values()]
            .sort(
                (a, b) =>
                    b.quantidade -
                    a.quantidade
            )
            .slice(0, 5);

    }

    get totalPromocoesAtivas(): number {

        return this.produtos.filter(
            produto =>
                produto.promocaoAtiva
        ).length;

    }

    get possuiIndicadoresPromocionais(): boolean {

        return (
            this.totalPromocoesAtivas > 0 ||
            this.totalVendasPromocionais > 0
        );

    }

    obterQuantidadeComprada(
        produtoId: string
    ): number {

        return this.movimentacoes
            .filter(
                mov =>
                    mov.produtoId === produtoId &&
                    mov.tipo === 'entrada'
            )
            .reduce(
                (total, mov) =>
                    total + mov.quantidade,
                0
            );

    }

    obterQuantidadeVendida(
        produtoId: string
    ): number {

        return this.movimentacoes
            .filter(
                mov =>
                    mov.produtoId === produtoId &&
                    mov.tipo === 'saida'
            )
            .reduce(
                (total, mov) =>
                    total + mov.quantidade,
                0
            );

    }

    obterPercentualGiro(
        produtoId: string
    ): number {

        const comprado =
            this.obterQuantidadeComprada(
                produtoId
            );

        const vendido =
            this.obterQuantidadeVendida(
                produtoId
            );

        if (comprado === 0) {
            return 0;
        }

        return Math.round(
            (vendido / comprado) * 100
        );

    }

    get totalPromocoesEficientes(): number {

        return this.produtos.filter(
            produto =>
                produto.promocaoAtiva &&
                this.obterPercentualGiro(
                    produto.id
                ) >= 70
        ).length;

    }

    get promocoesEficientes() {

        return this.produtos
            .filter(
                produto =>
                    produto.promocaoAtiva &&
                    this.obterPercentualGiro(
                        produto.id
                    ) >= 70
            )
            .map(produto => ({
                nome: produto.nome,
                giro: this.obterPercentualGiro(
                    produto.id
                )
            }))
            .sort(
                (a, b) =>
                    b.giro - a.giro
            );

    }

    get promocoesBaixaEfetividade() {

        return this.produtos
            .filter(
                produto =>
                    produto.promocaoAtiva &&
                    this.obterPercentualGiro(
                        produto.id
                    ) < 40
            )
            .map(produto => ({
                nome: produto.nome,
                giro: this.obterPercentualGiro(
                    produto.id
                )
            }))
            .sort(
                (a, b) =>
                    a.giro - b.giro
            );

    }

    get evolucaoVendasPorDia() {

        const agrupado = new Map<
            string,
            number
        >();

        for (
            const venda of this.vendasFiltradas) {

            if (
                venda.status === 'cancelada'
            ) {
                continue;
            }

            const data =
                new Date(
                    venda.dataVenda
                ).toLocaleDateString(
                    'pt-BR'
                );

            const atual =
                agrupado.get(data) ?? 0;

            agrupado.set(
                data,
                atual + venda.valorTotal
            );

        }

        return [...agrupado.entries()]
            .map(
                ([data, total]) => ({
                    data,
                    total
                })
            );
    }

    get vendasChartData() {

        return {

            labels:
                this.evolucaoVendasPorDia.map(
                    item => item.data
                ),

            datasets: [

                {

                    label: 'Faturamento',

                    data:
                        this.evolucaoVendasPorDia.map(
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
                value: this.totalVendasPeriodo,
                variant: 'info'
            },

            {
                title: 'Faturamento',
                value: this.faturamentoPeriodo.toLocaleString(
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
                value: this.fiadosEmAberto.toLocaleString(
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
                value: this.produtos.length,
                variant: 'info'
            },

            {
                title: 'Clientes Devedores',
                value: this.clientesDevedores,
                variant: 'danger'
            },

            {
                title: 'Estoque Baixo',
                value: this.produtosComEstoqueBaixo,
                variant: 'warning'
            }

        ];

    }

    get faturamentoPorPagamento() {

        const ranking = new Map<
            string,
            number
        >();

        for (
            const venda of this.vendasFiltradas) {

            if (
                venda.status === 'cancelada'
            ) {
                continue;
            }

            const atual =
                ranking.get(
                    venda.formaPagamento
                ) ?? 0;

            ranking.set(
                venda.formaPagamento,
                atual + venda.valorTotal
            );

        }

        return [...ranking.entries()]
            .map(
                ([formaPagamento, valor]) => ({

                    formaPagamento,

                    valor

                })
            );

    }

    get pagamentoChartData() {

        return {

            labels:
                this.faturamentoPorPagamento.map(
                    item =>
                        item.formaPagamento
                ),

            datasets: [

                {

                    data:
                        this.faturamentoPorPagamento.map(
                            item =>
                                item.valor
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

        return {

            labels:
                this.topProdutosVendidos.map(
                    produto => produto.nome
                ),

            datasets: [

                {

                    label: 'Quantidade Vendida',

                    data:
                        this.topProdutosVendidos.map(
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

    get evolucaoFiadosPorDia() {

        const agrupado = new Map<
            string,
            number
        >();

        for (const fiado of this.fiados) {

            const data =
                new Date(
                    fiado.dataLancamento
                ).toLocaleDateString(
                    'pt-BR'
                );

            const atual =
                agrupado.get(data) ?? 0;

            agrupado.set(
                data,
                atual + fiado.valorTotal
            );

        }

        return [...agrupado.entries()]
            .map(
                ([data, total]) => ({
                    data,
                    total
                })
            );

    }

    get fiadosChartData() {

        return {

            labels:
                this.evolucaoFiadosPorDia.map(
                    item => item.data
                ),

            datasets: [

                {

                    label: 'Fiados',

                    data:
                        this.evolucaoFiadosPorDia.map(
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

    get produtosMaiorGiro() {

        return this.produtos

            .map(produto => ({

                nome: produto.nome,

                giro:
                    this.obterPercentualGiro(
                        produto.id
                    )

            }))

            .filter(
                produto =>
                    produto.giro > 0
            )

            .sort(
                (a, b) =>
                    b.giro - a.giro
            )

            .slice(0, 5);

    }

    get giroChartData() {

        return {

            labels:
                this.produtosMaiorGiro.map(
                    produto =>
                        produto.nome
                ),

            datasets: [

                {

                    label: 'Giro (%)',

                    data:
                        this.produtosMaiorGiro.map(
                            produto =>
                                produto.giro
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


}