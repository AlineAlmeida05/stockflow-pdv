import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { MovimentacaoEstoque } from '../../core/models/movimentacao-estoque.model';
import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';
import { ReportVendas } from './components/report-vendas/report-vendas';
import { ReportEstoque } from './components/report-estoque/report-estoque';
import { ReportHeader } from '../../shared/components/report-header/report-header';
import { ReportFiados } from './components/report-fiados/report-fiados';
import { ReportFinanceiro } from './components/report-financeiro/report-financeiro';
import { PdfExportService } from '../../core/services/pdf-export.service';
import { ExcelExportService } from '../../core/services/excel-export.service';
import { AlertService } from '../../core/services/alert.service';
import { DashboardVendas } from '../../core/models/dashboard-vendas.model';
import { RelatorioService } from '../../core/services/relatorio.service';
import { DashboardEstoque } from '../../core/models/dashboard-estoque.model';
import { RelatorioEstoqueService } from '../../core/services/relatorio-estoque.service';
import { DashboardFiados } from '../../core/models/dashboard-fiados.model';
import { RelatorioFiadosService } from '../../core/services/relatorio-fiados.service';

@Component({
    selector: 'app-relatorios',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
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

    produtos: Produto[] = [];

    movimentacoes: MovimentacaoEstoque[] = [];

    dashboard?: DashboardVendas;

    dashboardEstoque?: DashboardEstoque;

    dashboardFiados?: DashboardFiados;

    periodoSelecionado: string = 'todos';

    formaPagamentoSelecionada: string = 'todos';

    dataInicio = '';

    dataFim = '';

    colunasVendas: {
        field: string;
        header: string;
        type?:
        | 'text'
        | 'badge'
        | 'currency'
        | 'date';
    }[] = [
            {
                field: 'dataVenda',
                header: 'Data',
                type: 'date',
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

    colunasEstoque: {
        field: string;
        header: string;
        type?:
        | 'text'
        | 'badge'
        | 'currency'
        | 'date';
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
        type?:
        | 'text'
        | 'badge'
        | 'currency'
        | 'date';
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
        type?:
        | 'text'
        | 'badge'
        | 'currency'
        | 'date';
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
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService,
        private pdfExportService: PdfExportService,
        private excelExportService: ExcelExportService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef,
        private relatorioService: RelatorioService,
        private relatorioEstoqueService: RelatorioEstoqueService,
        private relatorioFiadosService: RelatorioFiadosService,
    ) { }

    ngOnInit(): void {

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

        this.carregarRelatorio();

        this.carregarRelatorioEstoque();

        this.carregarRelatorioFiados();

        this.cdr.detectChanges();

    }

    get totalVendas(): number {

        return this.dashboard?.resumo
            ?.totalVendas ?? 0;

    }

    get faturamentoTotal(): number {

        return this.dashboard?.resumo
            ?.faturamento ?? 0;

    }

    get ticketMedio(): number {

        return this.dashboard?.resumo
            ?.ticketMedio ?? 0;

    }

    get vendasTabela() {

        return (
            this.dashboard?.historico ?? []
        ).map(venda => ({

            dataVenda:
                venda.dataHora,

            formaPagamento:
                venda.formaPagamento,

            quantidadeItens:
                venda.itens,

            valorTotalFormatado:
                Number(venda.valor)
                    .toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    )

        }));

    }

    get topProdutosVendidos() {

        return this.dashboard?.top5Produtos ?? [];

    }

    get evolucaoVendasPorDia() {

        return (
            this.dashboard?.evolucaoVendas ?? []
        ).map(item => ({

            data: item.data,

            total: item.valor

        }));

    }

    get totalProdutos(): number {

        return this.dashboardEstoque
            ?.resumo
            ?.totalProdutos ?? 0;

    }

    get produtosSemEstoque() {

        return Array.from({
            length:
                this.dashboardEstoque
                    ?.resumo
                    ?.semEstoque ?? 0
        });

    }

    get produtosEstoqueBaixo() {

        return Array.from({
            length:
                this.dashboardEstoque
                    ?.resumo
                    ?.estoqueBaixo ?? 0
        });

    }

    get produtosReposicao() {

        return Array.from({
            length:
                this.dashboardEstoque
                    ?.resumo
                    ?.reposicao ?? 0
        });

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

        return this.dashboardEstoque
            ?.produtosSemMovimentacao ?? [];

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

        return this.dashboardEstoque
            ?.sugestoesReposicao ?? [];

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

        return this.dashboardFiados
            ?.resumo
            ?.valorEmAberto ?? 0;

    }

    get totalPendentes(): number {

        return this.dashboardFiados
            ?.resumo
            ?.pendentes ?? 0;

    }

    get totalPagos(): number {

        return this.dashboardFiados
            ?.resumo
            ?.pagos ?? 0;

    }

    get clientesDevedores(): number {

        return this.dashboardFiados
            ?.resumo
            ?.clientesDevedores ?? 0;

    }

    get maioresDevedores() {

        return this.dashboardFiados
            ?.maioresDevedores ?? [];

    }

    get fiadosTabela() {

        return (
            this.dashboardFiados
                ?.ultimosLancamentos ?? []
        ).map(fiado => ({

            clienteNome:
                fiado.clienteNome,

            valorTotal:
                fiado.valor,

            valorFormatado:
                Number(fiado.valor)
                    .toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    ),

            status:
                fiado.status

        }));

    }

    get valorFiados(): number {

        return this.dashboardFiados
            ?.resumo
            ?.valorRecebido ?? 0;

    }

    get receitaRealizada(): number {

        return (
            this.faturamentoTotal -
            this.valorEmAberto
        )
    }

    get faturamentoPorPagamento() {

        return (
            this.dashboard
                ?.receitaPorFormaPagamento ?? []
        ).map(item => ({

            formaPagamento: item.formaPagamento,

            valor: item.valor

        }));

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
                        venda.valorTotalFormatado

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
                    Indicador: 'Valor Recebido',
                    Valor:
                        this.dashboardFiados
                            ?.resumo
                            ?.valorRecebido ?? 0
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
                    Valor: this.valorRecebido
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

    private carregarRelatorio(): void {

        this.atualizarPeriodo();

        this.relatorioService
            .buscar(
                this.dataInicio,
                this.dataFim,
                this.formaPagamentoSelecionada ===
                    'todos'
                    ? undefined
                    : this.formaPagamentoSelecionada
            )

            .subscribe({

                next: response => {

                    this.dashboard = response;

                    this.cdr.detectChanges();
                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    private atualizarPeriodo(): void {

        const hoje = new Date();

        this.dataFim =
            hoje.toISOString()
                .split('T')[0];

        switch (
        this.periodoSelecionado
        ) {

            case 'hoje':

                this.dataInicio = this.dataFim;

                break;

            case 'ontem': {

                const ontem = new Date();

                ontem.setDate(
                    ontem.getDate() - 1
                );

                const dataOntem = ontem
                    .toISOString()
                    .split('T')[0];

                this.dataInicio = dataOntem;

                this.dataFim = dataOntem;

                break;
            }

            case '7dias': {

                const data = new Date();

                data.setDate(
                    data.getDate() - 7
                );

                this.dataInicio =
                    data.toISOString()
                        .split('T')[0];

                break;
            }

            case '30dias': {

                const data = new Date();

                data.setDate(
                    data.getDate() - 30
                );

                this.dataInicio =
                    data.toISOString()
                        .split('T')[0];

                break;
            }

            default:

                this.dataInicio = '2026-01-01';

                break;
        }

    }

    alterarPeriodo(
        periodo: string
    ): void {

        this.periodoSelecionado =
            periodo;

        this.carregarRelatorio();

    }

    alterarFormaPagamento(
        formaPagamento: string
    ): void {

        this.formaPagamentoSelecionada =
            formaPagamento;

        this.carregarRelatorio();

    }

    private carregarRelatorioEstoque(): void {

        this.relatorioEstoqueService
            .buscar()
            .subscribe({

                next: response => {

                    this.dashboardEstoque = response;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }

            });

    }

    private carregarRelatorioFiados(): void {

        this.relatorioFiadosService
            .buscar()
            .subscribe({

                next: response => {

                    this.dashboardFiados =
                        response;

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    get valorRecebido(): number {

        return this.dashboardFiados
            ?.resumo
            ?.valorRecebido ?? 0;

    }
}