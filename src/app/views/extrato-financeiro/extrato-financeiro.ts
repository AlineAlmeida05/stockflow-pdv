import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { MovimentacaoFinanceira } from '../../core/models/movimentacao-financeira.model';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { SelectInput } from '../../shared/components/select-input/select-input';
import { ExtratoFinanceiroService } from '../../core/services/extrato-financeiro.service';
import { IndicadoresExtrato } from '../../core/models/indicadores-extrato.model';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { DataTable } from '../../shared/components/data-table/data-table';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
@Component({
    selector: 'app-extrato-financeiro',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        CurrencyPipe,
        DatePipe,
        EmptyState,
        SearchInput,
        Toolbar,
        SelectInput,
        StatCard,
        DataTable,
        SplitPanel
    ],
    templateUrl: './extrato-financeiro.html',
    styleUrl: './extrato-financeiro.scss'
})
export class ExtratoFinanceiro

    implements OnInit {

    movimentacoes: MovimentacaoFinanceira[] = [];

    textoBusca = '';

    tipoMovimentacaoSelecionado = 'todos';

    indicadores?: IndicadoresExtrato;

    formaPagamentoSelecionada = 'todos';

    periodoSelecionado = 'todos';

    mostrarPainel = false;

    movimentacaoSelecionada:
        MovimentacaoFinanceira
        | null = null;

    opcoesItensPorPagina = [

        {
            label: '10 por página',
            value: '10'
        },

        {
            label: '25 por página',
            value: '25'
        },

        {
            label: '50 por página',
            value: '50'
        },

        {
            label: '100 por página',
            value: '100'
        }

    ];

    tiposMovimentacao = [
        {
            label: 'Todas',
            value: 'todos'
        },
        {
            label: 'Vendas',
            value: 'venda'
        },
        {
            label: 'Fiados',
            value: 'fiado'
        },
        {
            label: 'Pagamentos',
            value: 'pagamento'
        }
    ];

    cards: {
        title: string;
        value: string | number;
        variant:
        | 'info'
        | 'success'
        | 'warning'
        | 'danger';
    }[] = [];

    periodos = [
        {
            label: 'Todos',
            value: 'todos'
        },
        {
            label: 'Hoje',
            value: 'hoje'
        },
        {
            label: '7 Dias',
            value: '7dias'
        },
        {
            label: '30 Dias',
            value: '30dias'
        }
    ];

    colunasMovimentacoes = [
        {
            field: 'dataFormatada',
            header: 'Data'
        },
        {
            field: 'tipoDescricao',
            header: 'Tipo'
        },
        {
            field: 'cliente',
            header: 'Cliente'
        },
        {
            field: 'valorFormatado',
            header: 'Valor'
        }
    ];

    formasPagamento = [
        {
            label: 'Todas',
            value: 'todos'
        },
        {
            label: 'PIX',
            value: 'PIX'
        },
        {
            label: 'Dinheiro',
            value: 'DINHEIRO'
        },
        {
            label: 'Crédito',
            value: 'CREDITO'
        },
        {
            label: 'Débito',
            value: 'DEBITO'
        },
        {
            label: 'Fiado',
            value: 'FIADO'
        }
    ];

    @ViewChild(SearchInput)
    searchInput?: SearchInput;

    constructor(
        private extratoFinanceiroService: ExtratoFinanceiroService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {

        this.carregarMovimentacoes();

        this.carregarIndicadores();

    }

    fecharPainel(): void {
        this.movimentacaoSelecionada = null;
        this.mostrarPainel = false;
    }

    private carregarIndicadores(): void {

        this.extratoFinanceiroService
            .obterIndicadores()
            .subscribe({

                next: indicadores => {

                    this.indicadores = indicadores;

                    this.atualizarIndicadores();

                    this.cdr.detectChanges();
                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    carregarMovimentacoes(): void {

        this.extratoFinanceiroService
            .listar()
            .subscribe({

                next: movimentacoes => {

                    this.movimentacoes = movimentacoes;

                    this.atualizarIndicadores();

                    setTimeout(() => {

                        this.searchInput?.focar();

                    });

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    get movimentacoesFiltradas(): MovimentacaoFinanceira[] {

        return this.movimentacoes.filter(
            movimentacao => {

                const busca =
                    this.textoBusca
                        .toLowerCase()
                        .trim();

                const atendeFormaPagamento =

                    this.formaPagamentoSelecionada === 'todos'

                    ||

                    movimentacao.formaPagamento ===
                    this.formaPagamentoSelecionada;

                const atendeBusca = !busca

                    ||

                    (
                        movimentacao.clienteNome ?? ''
                    )
                        .toLowerCase()
                        .includes(busca)

                    ||

                    (
                        movimentacao.usuarioNome ?? ''
                    )
                        .toLowerCase()
                        .includes(busca)

                    ||

                    (
                        movimentacao.formaPagamento ?? ''
                    )
                        .toLowerCase()
                        .includes(busca)

                    ||

                    (
                        movimentacao.tipo ?? ''
                    )
                        .toLowerCase()
                        .includes(busca);


                const atendeTipo = this.tipoMovimentacaoSelecionado === 'todos'

                    ||

                    movimentacao.tipo ===
                    this.tipoMovimentacaoSelecionado;

                const atendePeriodo =

                    this.movimentacaoDentroPeriodo(
                        movimentacao.data
                    );

                return (
                    atendeBusca
                    &&
                    atendeTipo
                    &&
                    atendePeriodo
                );

            }
        );

    }

    obterTituloMovimentacao(
        movimentacao: MovimentacaoFinanceira
    ): string {

        switch (movimentacao.tipo) {

            case 'venda':
                return '🛒 Venda';

            case 'fiado':
                return '📄 Fiado';

            case 'pagamento':
                return '💰 Pagamento';

            default:
                return 'Movimentação';

        }

    }

    private atualizarIndicadores(): void {

        const totalRecebido = this.indicadores?.totalRecebido ?? 0;

        const saldoAberto = this.indicadores?.saldoAberto ?? 0;

        const recebimentosHoje = this.indicadores?.recebimentosHoje ?? 0;

        const clientesDevedores = this.indicadores?.clientesDevedores ?? 0;

        this.cards = [

            {
                title: 'Total Recebido',
                value:
                    totalRecebido.toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    ),
                variant: 'success'
            },

            {
                title: 'Saldo em Aberto',
                value:
                    saldoAberto.toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    ),
                variant: 'warning'
            },

            {
                title: 'Recebimentos Hoje',
                value:
                    recebimentosHoje
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        ),
                variant: 'info'
            },

            {
                title: 'Clientes Devedores',
                value:
                    clientesDevedores,
                variant: 'danger'
            }

        ];

    }

    private movimentacaoDentroPeriodo(
        dataMovimentacao: string
    ): boolean {

        if (
            this.periodoSelecionado ===
            'todos'
        ) {
            return true;
        }

        const hoje = new Date();

        const data = new Date(
            dataMovimentacao
        );

        const diferencaDias =

            (
                hoje.getTime()
                -
                data.getTime()
            )

            /

            (
                1000 * 60 * 60 * 24
            );

        if (
            this.periodoSelecionado ===
            'hoje'
        ) {

            return (
                hoje.toDateString()
                ===
                data.toDateString()
            );

        }

        if (
            this.periodoSelecionado ===
            '7dias'
        ) {

            return (
                diferencaDias <= 7
            );

        }

        if (
            this.periodoSelecionado ===
            '30dias'
        ) {

            return (
                diferencaDias <= 30
            );

        }

        return true;

    }

    get movimentacoesTabela(): unknown[] {

        return this.movimentacoesFiltradas.map(
            movimentacao => ({

                ...movimentacao,

                dataFormatada:
                    new Date(
                        movimentacao.data
                    ).toLocaleString('pt-BR'),

                cliente:
                    movimentacao.clienteNome
                    || 'Consumidor Final',

                valorFormatado:
                    movimentacao.valor
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        ),

                tipoDescricao:
                    this.obterTituloMovimentacao(
                        movimentacao
                    )

            })
        );

    }

    visualizarMovimentacao(
        movimentacao: unknown
    ): void {

        this.movimentacaoSelecionada = movimentacao as MovimentacaoFinanceira;

        this.mostrarPainel = true;

    }
}