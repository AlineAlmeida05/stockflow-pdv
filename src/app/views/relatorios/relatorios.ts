import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Venda } from '../../core/models/venda.model';
import { VendaService } from '../../core/services/venda.service';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { MovimentacaoEstoque } from '../../core/models/movimentacao-estoque.model';

import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';
import { Fiado } from '../../core/models/fiado.model';

import { FiadoService } from '../../core/services/fiado.service';
import { ReportVendas } from './components/report-vendas/report-vendas';
import { ReportEstoque } from './components/report-estoque/report-estoque';
import { ReportHeader } from '../../shared/components/report-header/report-header';
import { ReportFiados } from './components/report-fiados/report-fiados';
import { ReportFinanceiro } from './components/report-financeiro/report-financeiro';
import { PdfExportService } from '../../core/services/pdf-export.service';
import { ExcelExportService } from '../../core/services/excel-export.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
    selector: 'app-relatorios',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        PageTitle,
        StatCard,
        DataTable,
        FormsModule,
        ReportVendas,
        ReportEstoque,
        ReportHeader,
        ReportFiados,
        ReportFinanceiro
    ],
    templateUrl: './relatorios.html',
    styleUrl: './relatorios.scss'
})

export class Relatorios
    implements OnInit {

    vendas: Venda[] = [];

    produtos: Produto[] = [];

    movimentacoes: MovimentacaoEstoque[] = [];

    fiados: Fiado[] = [];

    colunasVendas: {
        field: string;
        header: string;
        type?: 'text' | 'badge';
    }[] = [
            {
                field: 'dataVenda',
                header: 'Data'
            },
            {
                field: 'formaPagamento',
                header: 'Pagamento'
            },
            {
                field: 'quantidadeItens',
                header: 'Itens'
            },
            {
                field: 'valorTotalFormatado',
                header: 'Valor'
            }
        ];

    periodoSelecionado: string =
        'todos';

    formaPagamentoSelecionada: string =
        'todos';


    colunasEstoque: {
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
                header: 'Atual'
            },
            {
                field: 'estoqueMinimo',
                header: 'Mínimo'
            },
            {
                field: 'statusEstoque',
                header: 'Status',
                type: 'badge'
            }
        ];

    colunasGiroEstoque: {
        field: string;
        header: string;
    }[] = [
            {
                field: 'nome',
                header: 'Produto'
            },
            {
                field: 'comprado',
                header: 'Comprado'
            },
            {
                field: 'vendido',
                header: 'Vendido'
            },
            {
                field: 'giro',
                header: 'Giro'
            }
        ];

    colunasFiados: {
        field: string;
        header: string;
        type?: 'text' | 'badge';
    }[] = [
            {
                field: 'clienteNome',
                header: 'Cliente'
            },
            {
                field: 'valorFormatado',
                header: 'Valor'
            },
            {
                field: 'status',
                header: 'Status',
                type: 'badge'
            }
        ];

    abaSelecionada:
        | 'vendas'
        | 'estoque'
        | 'fiados'
        | 'financeiro'
        = 'vendas';

    @ViewChild('reportContent')
    reportContent!: ElementRef<HTMLElement>;

    constructor(
        private vendaService: VendaService,
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService,
        private fiadoService: FiadoService,
        private pdfExportService: PdfExportService,
        private excelExportService: ExcelExportService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {

        this.vendas =
            this.vendaService.listar();

        this.produtos =
            this.produtoService.listar();

        this.movimentacoes =
            this.movimentacaoService.listar();

        this.fiados =
            this.fiadoService.listar();

    }

    get totalVendas(): number {

        return this.vendasRelatorio.length;

    }

    get faturamentoTotal(): number {

        return this.vendasRelatorio.reduce(
            (total, venda) =>
                total + venda.valorTotal,
            0
        );

    }

    get ticketMedio(): number {

        if (
            this.vendasRelatorio.length === 0
        ) {
            return 0;
        }

        return Number(
            (
                this.faturamentoTotal /
                this.totalVendas
            ).toFixed(2)
        );

    }

    get vendasTabela() {

        return this.vendasRelatorio.map(
            venda => ({

                ...venda,

                valorTotalFormatado:
                    venda.valorTotal
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        )

            })
        );

    }

    get vendasFiltradas(): Venda[] {

        const hoje =
            new Date();

        switch (
        this.periodoSelecionado
        ) {

            case 'hoje':

                return this.vendas.filter(
                    venda =>
                        new Date(
                            venda.dataVenda
                        ).toDateString() ===
                        hoje.toDateString()
                );

            case 'ontem':

                const ontem =
                    new Date();

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

            default:

                return this.vendas;

        }

    }

    get vendasRelatorio(): Venda[] {

        if (
            this.formaPagamentoSelecionada ===
            'todos'
        ) {

            return this.vendasFiltradas;

        }

        return this.vendasFiltradas.filter(
            venda =>
                venda.formaPagamento ===
                this.formaPagamentoSelecionada
        );

    }

    get topProdutosVendidos() {

        const ranking = new Map<
            string,
            {
                nome: string;
                quantidade: number;
            }
        >();

        for (const venda of this.vendasRelatorio) {

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

    get formasPagamentoRanking() {

        const ranking = new Map<
            string,
            number
        >();

        for (const venda of this.vendasRelatorio) {

            const atual =
                ranking.get(
                    venda.formaPagamento
                ) ?? 0;

            ranking.set(
                venda.formaPagamento,
                atual + 1
            );

        }

        return [...ranking.entries()]
            .map(
                ([formaPagamento, total]) => ({

                    formaPagamento,

                    total

                })
            )
            .sort(
                (a, b) =>
                    b.total - a.total
            );

    }

    get formaPagamentoMaisUtilizada(): string {

        if (
            this.formasPagamentoRanking
                .length === 0
        ) {

            return '-';

        }

        return this.formasPagamentoRanking[0]
            .formaPagamento;

    }

    get evolucaoVendasPorDia() {

        const agrupado = new Map<
            string,
            number
        >();

        for (const venda of this.vendasRelatorio) {

            const data =
                new Date(
                    venda.dataVenda
                ).toLocaleDateString(
                    'pt-BR'
                );

            const totalAtual =
                agrupado.get(
                    data
                ) ?? 0;

            agrupado.set(
                data,
                totalAtual +
                venda.valorTotal
            );

        }

        return [...agrupado.entries()]
            .map(
                ([data, total]) => ({

                    data,

                    total

                })
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.data
                            .split('/')
                            .reverse()
                            .join('-')
                    ).getTime()
                    -
                    new Date(
                        b.data
                            .split('/')
                            .reverse()
                            .join('-')
                    ).getTime()
            );

    }

    get melhorDiaVendas() {

        if (
            this.evolucaoVendasPorDia.length === 0
        ) {

            return undefined;

        }

        return [...this.evolucaoVendasPorDia]
            .sort(
                (a, b) =>
                    b.total - a.total
            )[0];

    }

    get melhorDiaData(): string {

        return this.melhorDiaVendas?.data ?? '-';

    }

    get melhorDiaValor(): string {

        return (
            this.melhorDiaVendas?.total ?? 0
        ).toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        );

    }

    get produtosMaisRentaveis() {

        const ranking = new Map<
            string,
            {
                nome: string;
                faturamento: number;
            }
        >();

        for (const venda of this.vendasRelatorio) {

            for (const item of venda.itens) {

                const atual =
                    ranking.get(
                        item.produtoId
                    );

                if (atual) {

                    atual.faturamento +=
                        item.subtotal;

                } else {

                    ranking.set(
                        item.produtoId,
                        {
                            nome:
                                item.produtoNome,

                            faturamento:
                                item.subtotal
                        }
                    );

                }

            }

        }

        return [...ranking.values()]
            .sort(
                (a, b) =>
                    b.faturamento -
                    a.faturamento
            );

    }

    get produtoMaisFaturou() {

        if (
            this.produtosMaisRentaveis.length === 0
        ) {

            return undefined;

        }

        return this.produtosMaisRentaveis[0];

    }

    get produtosSemVendaNoPeriodo() {

        const produtosVendidos =
            new Set<string>();

        for (const venda of this.vendasRelatorio) {

            for (const item of venda.itens) {

                produtosVendidos.add(
                    item.produtoId
                );

            }

        }

        return this.produtos.filter(
            produto =>
                !produtosVendidos.has(
                    produto.id
                )
        );

    }

    get produtosPromocionais() {

        return this.produtos
            .filter(
                produto =>
                    produto.promocaoAtiva
            );

    }

    get totalProdutos(): number {

        return this.produtos.length;

    }

    get produtosSemEstoque(): Produto[] {

        return this.produtos.filter(
            produto =>
                produto.estoqueAtual === 0
        );

    }

    get produtosEstoqueBaixo(): Produto[] {

        return this.produtos.filter(
            produto =>
                produto.estoqueAtual > 0 &&
                produto.estoqueAtual <=
                produto.estoqueMinimo
        );

    }

    get produtosReposicao(): Produto[] {

        return this.produtos.filter(
            produto =>
                produto.estoqueAtual <=
                produto.estoqueMinimo
        );

    }

    get produtosTabela() {

        return this.produtos.map(
            produto => ({

                ...produto,

                statusEstoque:

                    produto.estoqueAtual <=
                        produto.estoqueMinimo

                        ? 'Baixo'

                        : produto.estoqueAtual <=
                            produto.estoqueMinimo * 2

                            ? 'Atenção'

                            : 'Em Estoque'

            })
        );

    }

    get produtosSemMovimentacao() {

        const produtosMovimentados =
            new Set<string>();

        for (
            const movimentacao of
            this.movimentacoes
        ) {

            produtosMovimentados.add(
                movimentacao.produtoId
            );

        }

        return this.produtos.filter(
            produto =>
                !produtosMovimentados.has(
                    produto.id
                )
        );

    }

    obterQuantidadeComprada(
        produtoId: string
    ): number {

        return this.movimentacoes
            .filter(
                movimentacao =>
                    movimentacao.produtoId === produtoId &&
                    movimentacao.tipo === 'entrada'
            )
            .reduce(
                (total, movimentacao) =>
                    total + movimentacao.quantidade,
                0
            );

    }

    obterQuantidadeVendida(
        produtoId: string
    ): number {

        return this.movimentacoes
            .filter(
                movimentacao =>
                    movimentacao.produtoId === produtoId &&
                    movimentacao.tipo === 'saida'
            )
            .reduce(
                (total, movimentacao) =>
                    total + movimentacao.quantidade,
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

    get produtosGiroEstoque() {

        return this.produtos.map(
            produto => ({

                nome: produto.nome,

                comprado:
                    this.obterQuantidadeComprada(
                        produto.id
                    ),

                vendido:
                    this.obterQuantidadeVendida(
                        produto.id
                    ),

                giro:
                    this.obterPercentualGiro(
                        produto.id
                    ) + '%'

            })
        );

    }

    get produtosMenorGiro() {

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
                    a.giro - b.giro
            )
            .slice(0, 5);

    }

    get sugestoesReposicao() {

        return this.produtos
            .filter(
                produto =>
                    produto.estoqueAtual <=
                    produto.estoqueMinimo
            )
            .map(produto => ({

                ...produto,

                quantidadeReposicao:
                    produto.estoqueMinimo -
                    produto.estoqueAtual

            }))
            .sort(
                (a, b) =>
                    a.estoqueAtual -
                    b.estoqueAtual
            );

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

    get valorEmAberto(): number {

        return this.fiados
            .filter(
                fiado =>
                    fiado.status === 'pendente'
            )
            .reduce(
                (total, fiado) =>
                    total + fiado.valorTotal,
                0
            );

    }

    get totalPendentes(): number {

        return this.fiados.filter(
            fiado =>
                fiado.status === 'pendente'
        ).length;

    }

    get totalPagos(): number {

        return this.fiados.filter(
            fiado =>
                fiado.status === 'quitado'
        ).length;

    }

    get clientesDevedores(): number {

        return new Set(

            this.fiados
                .filter(
                    fiado =>
                        fiado.status === 'pendente'
                )
                .map(
                    fiado =>
                        fiado.clienteId
                )

        ).size;

    }

    get maioresDevedores() {

        const ranking = new Map<
            string,
            {
                nome: string;
                total: number;
            }
        >();

        this.fiados
            .filter(
                fiado =>
                    fiado.status === 'pendente'
            )
            .forEach(fiado => {

                const atual =
                    ranking.get(
                        fiado.clienteId
                    );

                if (atual) {

                    atual.total +=
                        fiado.valorTotal;

                } else {

                    ranking.set(
                        fiado.clienteId,
                        {
                            nome:
                                fiado.clienteNome,

                            total:
                                fiado.valorTotal
                        }
                    );

                }

            });

        return [...ranking.values()]
            .sort(
                (a, b) =>
                    b.total - a.total
            )
            .slice(0, 5);

    }

    get ultimosFiados() {

        return [...this.fiados]
            .sort(
                (a, b) =>
                    new Date(
                        b.dataLancamento
                    ).getTime()
                    -
                    new Date(
                        a.dataLancamento
                    ).getTime()
            )
            .slice(0, 10);

    }

    get fiadosTabela() {

        return this.ultimosFiados.map(
            fiado => ({

                ...fiado,

                valorFormatado:
                    fiado.valorTotal
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        )

            })
        );

    }

    get totalParciais(): number {

        return this.fiados.filter(
            fiado =>
                fiado.status === 'parcial'
        ).length;

    }

    get maiorDevedor() {

        if (
            this.maioresDevedores.length === 0
        ) {

            return undefined;

        }

        return this.maioresDevedores[0];

    }

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

            const totalAtual =
                agrupado.get(data) ?? 0;

            agrupado.set(
                data,
                totalAtual +
                fiado.valorTotal
            );

        }

        return [...agrupado.entries()]
            .map(
                ([data, total]) => ({
                    data,
                    total
                })
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.data.split('/')
                            .reverse()
                            .join('-')
                    ).getTime()
                    -
                    new Date(
                        b.data.split('/')
                            .reverse()
                            .join('-')
                    ).getTime()
            );

    }

    get valorFiados(): number {

        return this.fiados.reduce(
            (total, fiado) =>
                total + fiado.valorTotal,
            0
        );

    }

    get receitaRealizada(): number {

        return (
            this.faturamentoTotal -
            this.valorEmAberto
        )
    }

    get faturamentoPorPagamento() {

        const ranking = new Map<
            string,
            number
        >();

        for (const venda of this.vendas) {

            const atual =
                ranking.get(
                    venda.formaPagamento
                ) ?? 0;

            ranking.set(
                venda.formaPagamento,
                atual +
                venda.valorTotal
            );

        }

        return [...ranking.entries()]
            .map(
                ([formaPagamento, valor]) => ({

                    formaPagamento,

                    valor

                })
            )
            .sort(
                (a, b) =>
                    b.valor - a.valor
            );

    }

    async exportarPdf(): Promise<void> {

        await this.pdfExportService.export(
            this.reportContent.nativeElement,
            `relatorio-${this.abaSelecionada
            }-${new Date()
                .toISOString()
                .split('T')[0]
            }`
        );

        this.alertService.success(
            'PDF exportado com sucesso!'
        );

    }


    exportarExcel(): void {

        const dataAtual =
            new Date()
                .toLocaleDateString(
                    'pt-BR'
                )
                .replaceAll('/', '-');

        // ABA VENDAS

        if (
            this.abaSelecionada === 'vendas'
        ) {

            const resumo = [
                {
                    Indicador: 'Gerado em',
                    Valor: new Date().toLocaleString('pt-BR')
                },
                {
                    Indicador: 'Total de Vendas',
                    Valor: this.totalVendas
                },
                {
                    Indicador: 'Faturamento Total',
                    Valor: this.faturamentoTotal
                },
                {
                    Indicador: 'Ticket Médio',
                    Valor: this.ticketMedio
                },
                {
                    Indicador: 'Forma Mais Utilizada',
                    Valor: this.formaPagamentoMaisUtilizada
                }

            ];

            const vendas = [...this.vendasTabela]

                .sort(
                    (a, b) =>
                        new Date(
                            b.dataVenda
                        ).getTime()
                        -
                        new Date(
                            a.dataVenda
                        ).getTime()
                )

                .map(venda => ({

                    Data:
                        this.formatarDataExcel(
                            venda.dataVenda
                        ),

                    'Forma de Pagamento':
                        this.formatarFormaPagamento(
                            venda.formaPagamento
                        ),

                    Itens:
                        venda.quantidadeItens,

                    Valor:
                        venda.valorTotal

                }));
            this.excelExportService.exportSheets(

                [

                    {
                        nome: 'Resumo',
                        dados: resumo
                    },

                    {
                        nome: 'Vendas',
                        dados: vendas
                    }

                ],

                `relatorio-vendas-${this.getDataExportacao()}`

            );

            this.alertService.success(
                'Excel exportado com sucesso!'
            );

        }

        // ABA ESTOQUE

        if (
            this.abaSelecionada === 'estoque'
        ) {

            const resumo = [
                {
                    Indicador: 'Gerado em',
                    Valor: new Date().toLocaleString('pt-BR')
                },
                {
                    Indicador: 'Total de Produtos',
                    Valor: this.totalProdutos
                },
                {
                    Indicador: 'Produtos sem Estoque',
                    Valor: this.produtosSemEstoque.length
                },
                {
                    Indicador: 'Produtos com Estoque Baixo',
                    Valor: this.produtosEstoqueBaixo.length
                },
                {
                    Indicador: 'Sugestões de Reposição',
                    Valor: this.sugestoesReposicao.length
                }

            ];

            const prioridadeStatus = {

                'Sem Estoque': 1,

                'Baixo': 2,

                'Atenção': 3,

                'Em Estoque': 4

            };

            const estoque =
                [...this.produtosTabela]

                    .sort(
                        (a, b) =>

                            (prioridadeStatus[
                                a.statusEstoque as keyof typeof prioridadeStatus
                            ] ?? 99)

                            -

                            (prioridadeStatus[
                                b.statusEstoque as keyof typeof prioridadeStatus
                            ] ?? 99)
                    )

                    .map(produto => ({

                        Produto:
                            produto.nome,

                        'Estoque Atual':
                            produto.estoqueAtual,

                        'Estoque Mínimo':
                            produto.estoqueMinimo,

                        Status:
                            produto.statusEstoque

                    }));

            const giro = this.produtosGiroEstoque.map(
                produto => ({

                    Produto: produto.nome,

                    Comprado: produto.comprado,

                    Vendido: produto.vendido,

                    Giro: produto.giro

                })
            );

            this.excelExportService.exportSheets(

                [

                    {
                        nome: 'Resumo',
                        dados: resumo
                    },

                    {
                        nome: 'Estoque Atual',
                        dados: estoque
                    },

                    {
                        nome: 'Giro Estoque',
                        dados: giro
                    }

                ],

                `relatorio-estoque-${this.getDataExportacao()}`

            );

        }

        // ABA FIADOS

        if (
            this.abaSelecionada === 'fiados'
        ) {

            const resumo = [
                {
                    Indicador: 'Gerado em',
                    Valor: new Date().toLocaleString('pt-BR')
                },
                {
                    Indicador: 'Valor em Aberto',
                    Valor: this.valorEmAberto
                },
                {
                    Indicador: 'Pendentes',
                    Valor: this.totalPendentes
                },
                {
                    Indicador: 'Pagos',
                    Valor: this.totalPagos
                },
                {
                    Indicador: 'Clientes Devedores',
                    Valor: this.clientesDevedores
                },
                {
                    Indicador: 'Pagamentos Parciais',
                    Valor: this.totalParciais
                }

            ];

            const fiados =
                [...this.fiadosTabela]

                    .sort(
                        (a, b) =>
                            b.valorTotal -
                            a.valorTotal
                    )

                    .map(fiado => ({

                        Cliente:
                            fiado.clienteNome,

                        Valor:
                            fiado.valorTotal,

                        Status:
                            fiado.status

                    }));

            const maioresDevedores =
                this.maioresDevedores.map(
                    cliente => ({

                        Cliente:
                            cliente.nome,

                        Total:
                            cliente.total

                    })
                );

            this.excelExportService.exportSheets(

                [

                    {
                        nome: 'Resumo Fiados',
                        dados: resumo
                    },

                    {
                        nome: 'Lançamentos',
                        dados: fiados
                    },

                    {
                        nome: 'Maiores Devedores',
                        dados: maioresDevedores
                    }

                ],

                `relatorio-fiados-${this.getDataExportacao()}`

            );

        }

        // ABA FINANCEIRO

        if (
            this.abaSelecionada === 'financeiro'
        ) {

            const resumo = [
                {
                    Indicador: 'Gerado em',
                    Valor: new Date().toLocaleString('pt-BR')
                },
                {
                    Indicador: 'Faturamento Total',

                    Valor:
                        this.faturamentoTotal
                            .toLocaleString(
                                'pt-BR',
                                {
                                    style: 'currency',
                                    currency: 'BRL'
                                }
                            )
                },
                {
                    Indicador: 'Valor em Fiados',
                    Valor: this.valorFiados
                },
                {
                    Indicador: 'Valor em Aberto',
                    Valor: this.valorEmAberto
                },
                {
                    Indicador: 'Receita Realizada',
                    Valor: this.receitaRealizada
                },
                {
                    Indicador: 'Ticket Médio',
                    Valor: this.ticketMedio
                }

            ];

            const pagamentos =

                [...this.faturamentoPorPagamento]

                    .sort(
                        (a, b) =>
                            b.valor -
                            a.valor
                    )

                    .map(pagamento => ({

                        'Forma de Pagamento':

                            this.formatarFormaPagamento(
                                pagamento.formaPagamento
                            ),

                        Valor:
                            pagamento.valor

                    }));

            this.excelExportService.exportSheets(

                [

                    {
                        nome: 'Resumo Financeiro',
                        dados: resumo
                    },

                    {
                        nome: 'Receita por Pagamento',
                        dados: pagamentos
                    }

                ],

                `relatorio-financeiro-${this.getDataExportacao()}`

            );

        }
    }

    private formatarDataExcel(
        data: string
    ): string {

        return new Date(data)
            .toLocaleDateString(
                'pt-BR'
            );

    }

    private formatarFormaPagamento(
        forma: string
    ): string {

        const mapa = {

            pix: 'PIX',

            dinheiro: 'Dinheiro',

            debito: 'Débito',

            credito: 'Crédito',

            fiado: 'Fiado'

        };

        return (
            mapa[
            forma as keyof typeof mapa
            ] ?? forma
        );

    }

    private getDataExportacao(): string {

        return new Date()
            .toLocaleDateString('pt-BR')
            .replaceAll('/', '-');

    }

}