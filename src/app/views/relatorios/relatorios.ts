import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
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
import { RelatorioService } from '../../core/services/relatorio.service';
import { DashboardVendas } from '../../core/models/dashboard-vendas.model';
import { RelatorioEstoqueService } from '../../core/services/relatorio-estoque.service';
import { DashboardEstoque } from '../../core/models/dashboard-estoque.model';
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
        ReportFinanceiro,
    ],
    templateUrl: './relatorios.html',
    styleUrl: './relatorios.scss'
})

export class Relatorios
    implements OnInit {

    produtos: Produto[] = [];

    movimentacoes: MovimentacaoEstoque[] = [];

    dashboardVendas?: DashboardVendas;

    fiados: Fiado[] = [];

    periodoSelecionado: string = 'todos';

    formaPagamentoSelecionada: string = 'todos';

    dashboardEstoque?: DashboardEstoque;

    dashboardFiados?: DashboardFiados;

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
                field: 'dataHora',
                header: 'Data',
                type: 'date',
            },
            {
                field: 'formaPagamento',
                header: 'Pagamento'
            },
            {
                field: 'itens',
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
        badgeClassFn?: (row: unknown) => string;
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
                type: 'badge',
                badgeClassFn: (row: unknown) => {

                    const produto = row as {
                        statusEstoque?: string;
                    };

                    switch (produto.statusEstoque) {

                        case 'Em Estoque':
                            return 'status-success';

                        case 'Atenção':
                            return 'status-warning';

                        case 'Baixo':
                        case 'Sem Estoque':
                            return 'status-danger';

                        default:
                            return '';
                    }
                }
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
        badgeClassFn?: (row: unknown) => string;
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
                type: 'badge',
                badgeClassFn: (row: unknown) => {

                    const fiado = row as {
                        status?: string;
                    };

                    switch (fiado.status) {

                        case 'quitado':
                            return 'status-success';

                        case 'pendente':
                            return 'status-danger';

                        default:
                            return '';
                    }
                }
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
        private fiadoService: FiadoService,
        private pdfExportService: PdfExportService,
        private excelExportService: ExcelExportService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef,
        private relatorioService: RelatorioService,
        private relatorioEstoqueService: RelatorioEstoqueService,
        private RelatorioFiadosService: RelatorioFiadosService
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

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

        this.relatorioService
            .buscar(
                '2020-01-01',
                '2099-12-31'
            )
            .subscribe({

                next: dashboard => {

                    this.dashboardVendas = dashboard;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar dashboard vendas',
                        erro
                    );

                }

            });

        this.relatorioEstoqueService
            .buscar()
            .subscribe({

                next: dashboard => {

                    this.dashboardEstoque = dashboard;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar dashboard estoque',
                        erro
                    );

                }

            });

        this.RelatorioFiadosService
            .buscar()
            .subscribe({

                next: dashboard => {

                    console.log(
                        'Dashboard Fiados',
                        dashboard
                    );

                    console.log(
                        'Chaves Dashboard Fiados',
                        Object.keys(
                            dashboard
                        )
                    );

                    this.dashboardFiados = dashboard;

                    this.cdr.detectChanges();

                },


                error: erro => {

                    console.error(
                        'Erro ao carregar dashboard fiados',
                        erro
                    );

                }

            });
    }

    get totalVendas(): number {

        return this.dashboardVendas
            ?.resumo
            ?.totalVendas
            ?? 0;

    }

    get faturamentoTotal(): number {

        return Number(
            this.dashboardVendas
                ?.resumo
                ?.faturamento
            ?? 0
        );

    }

    get ticketMedio(): number {

        return Number(
            this.dashboardVendas
                ?.resumo
                ?.ticketMedio
            ?? 0
        );

    }

    get vendasTabela() {

        return (
            this.dashboardVendas
                ?.historico
            ?? []
        ).map(venda => ({

            ...venda,

            valorTotalFormatado:
                Number(
                    venda.valor
                ).toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                )

        }));

    }

    get topProdutosVendidos() {

        return (
            this.dashboardVendas
                ?.top5Produtos
            ?? []
        ).map(produto => ({

            nome: produto.produtoNome,

            quantidade: produto.quantidadeVendida

        }));

    }

    get formaPagamentoMaisUtilizada(): string {

        return this.dashboardVendas
            ?.resumo
            ?.formaMaisUtilizada
            ?? '-';

    }

    get evolucaoVendasPorDia() {

        return (
            this.dashboardVendas
                ?.evolucaoVendas
            ?? []
        ).map(item => ({

            data: item.data,

            total: Number(
                item.valor
            )

        }));

    }

    get melhorDiaData(): string {

        return this.dashboardVendas
            ?.melhorDia
            ?.data
            ?? '-';

    }

    get melhorDiaValor(): string {

        return Number(
            this.dashboardVendas
                ?.melhorDia
                ?.valor
            ?? 0
        ).toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        );

    }

    get produtoMaisFaturou() {

        const produto =
            this.dashboardVendas
                ?.top5Produtos?.[0];

        if (!produto) {

            return undefined;

        }

        return {

            nome:
                produto.produtoNome,

            faturamento:
                produto.faturamento

        };

    }

    get produtosPromocionais() {

        return this.produtos
            .filter(
                produto =>
                    produto.promocaoAtiva
            );

    }

    get totalProdutos(): number {

        return this.dashboardEstoque
            ?.resumo
            ?.totalProdutos
            ?? 0;

    }

    get produtosSemEstoque() {

        return this.dashboardEstoque
            ?.produtosSemEstoque
            ?? [];

    }

    get produtosEstoqueBaixo() {

        return this.dashboardEstoque
            ?.produtosEstoqueBaixo
            ?? [];

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
            ?.produtosSemMovimentacao
            ?? [];

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

        return (
            this.dashboardEstoque
                ?.giroEstoque
            ?? []
        ).map(produto => ({

            ...produto,

            giro:
                produto.giro + '%'

        }));

    }

    get produtosMenorGiro() {

        return this.dashboardEstoque
            ?.produtosMenorGiro
            ?? [];

    }

    get sugestoesReposicao() {

        return this.dashboardEstoque
            ?.sugestoesReposicao
            ?? [];

    }

    get produtosMaiorGiro() {

        return this.dashboardEstoque
            ?.produtosMaiorGiro
            ?? [];

    }

    get valorEmAberto(): number {

        return this.dashboardFiados
            ?.resumo
            ?.valorEmAberto
            ?? 0;

    }

    get totalPendentes(): number {

        return this.dashboardFiados
            ?.resumo
            ?.pendentes
            ?? 0;

    }

    get totalPagos(): number {

        return this.dashboardFiados
            ?.resumo
            ?.pagos
            ?? 0;

    }


    get clientesDevedores(): number {

        return this.dashboardFiados
            ?.resumo
            ?.clientesDevedores
            ?? 0;

    }

    get maioresDevedores() {

        return this.dashboardFiados
            ?.maioresDevedores
            ?? [];

    }

    get ultimosFiados() {

        return this.dashboardFiados
            ?.ultimosLancamentos
            ?? [];

    }

    get fiadosTabela() {

        return this.ultimosFiados
            .map(fiado => ({

                ...fiado,

                valorFormatado:
                    Number(
                        fiado.valor
                    ).toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    )

            }));

    }

    get maiorDevedor() {

        return this.dashboardFiados
            ?.maioresDevedores?.[0];

    }

    get evolucaoFiadosPorDia() {

        return (
            this.dashboardFiados
                ?.evolucaoFiados
            ?? []
        ).map(item => ({

            data: item.data,

            total: Number(
                item.valor
            )

        }));

    }

    get valorFiados(): number {

        return Number(
            this.dashboardFiados
                ?.resumo
                ?.valorTotalFiados
            ?? 0
        );

    }

    get receitaRealizada(): number {

        return (
            this.faturamentoTotal -
            this.valorEmAberto
        )
    }

    get faturamentoPorPagamento() {

        return this.dashboardVendas
            ?.receitaPorFormaPagamento
            ?? [];

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
                            b.dataHora
                        ).getTime()
                        -
                        new Date(
                            a.dataHora
                        ).getTime()
                )

                .map(venda => ({

                    Data:
                        this.formatarDataExcel(
                            venda.dataHora
                        ),

                    'Forma de Pagamento':
                        this.formatarFormaPagamento(
                            venda.formaPagamento
                        ),

                    Itens: venda.itens,

                    Valor: venda.valorTotalFormatado

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

                        Produto: produto.nome,

                        'Estoque Atual': produto.estoqueAtual,

                        'Estoque Mínimo': produto.estoqueMinimo,

                        Status: produto.statusEstoque

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
                }

            ];

            const fiados =
                [...this.fiadosTabela]

                    .sort(
                        (a, b) =>
                            b.valor -
                            a.valor
                    )

                    .map(fiado => ({

                        Cliente: fiado.clienteNome,

                        Valor: fiado.valor,

                        Status: fiado.status

                    }));

            const maioresDevedores =
                this.maioresDevedores.map(
                    cliente => ({

                        Cliente: cliente.nome,

                        Total: cliente.total

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

                        Valor: pagamento.valor

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