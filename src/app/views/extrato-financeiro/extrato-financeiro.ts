import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { FiadoService } from '../../core/services/fiado.service';
import { PagamentoService } from '../../core/services/pagamento.service';
import { Fiado } from '../../core/models/fiado.model';
import { Pagamento } from '../../core/models/pagamento.model';
import { MovimentacaoFinanceira } from '../../core/models/movimentacao-financeira.model';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { SelectInput } from '../../shared/components/select-input/select-input';
import { StatCardCarousel } from '../../shared/components/stat-card-carousel/stat-card-carousel';

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
        StatCardCarousel
    ],
    templateUrl: './extrato-financeiro.html',
    styleUrl: './extrato-financeiro.scss'
})
export class ExtratoFinanceiro



    implements OnInit {

    movimentacoes:
        MovimentacaoFinanceira[] = [];

    textoBusca = '';

    formaPagamentoSelecionada = 'todos';

    formasPagamento = [

        {
            label: 'Todas',
            value: 'todos'
        },
        {
            label: 'Fiado',
            value: 'fiado'
        },
        {
            label: 'PIX',
            value: 'pix'
        },
        {
            label: 'Dinheiro',
            value: 'dinheiro'
        },
        {
            label: 'Débito',
            value: 'debito'
        },
        {
            label: 'Crédito',
            value: 'credito'
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

    periodoSelecionado = 'todos';

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

    constructor(
        private fiadoService: FiadoService,
        private pagamentoService: PagamentoService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {

        this.carregarMovimentacoes();

    }

    carregarMovimentacoes(): void {

        this.fiadoService
            .listar()
            .subscribe({

                next: fiados => {

                    this.carregarPagamentos(
                        fiados
                    );

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    private carregarPagamentos(
        fiados: Fiado[]
    ): void {

        this.pagamentoService
            .listar()
            .subscribe({

                next: pagamentos => {

                    this.montarTimeline(
                        fiados,
                        pagamentos
                    );

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    private montarTimeline(
        fiados: Fiado[],
        pagamentos: Pagamento[]
    ): void {

        const movimentacoesFiado =
            fiados.map(
                fiado => ({

                    tipo: 'fiado' as const,

                    clienteNome:
                        fiado.clienteNome,

                    valor:
                        fiado.valorTotal,

                    data:
                        fiado.dataLancamento

                })
            );

        const movimentacoesPagamento =
            pagamentos.map(
                pagamento => ({

                    tipo: 'pagamento' as const,

                    clienteNome:
                        pagamento.clienteNome,

                    valor:
                        pagamento.valorPago,

                    data:
                        pagamento.dataPagamento,

                    usuarioNome:
                        pagamento.usuarioNome,

                    formaPagamento:
                        pagamento.formaPagamento

                })
            );

        this.movimentacoes = [
            ...movimentacoesFiado,
            ...movimentacoesPagamento
        ]
            .sort(
                (a, b) =>
                    new Date(
                        b.data
                    ).getTime()

                    -

                    new Date(
                        a.data
                    ).getTime()
            );

        this.atualizarIndicadores();

        this.cdr.detectChanges();

    }

    get movimentacoesFiltradas(): MovimentacaoFinanceira[] {

        return this.movimentacoes.filter(
            movimentacao => {

                const atendeBusca =

                    movimentacao.clienteNome
                        .toLowerCase()
                        .includes(
                            this.textoBusca
                                .toLowerCase()
                        );

                const atendeTipo =

                    this.formaPagamentoSelecionada ===
                    'todos'

                    ||

                    (
                        this.formaPagamentoSelecionada ===
                        'fiado'

                        &&

                        movimentacao.tipo ===
                        'fiado'
                    )

                    ||

                    (
                        movimentacao.tipo ===
                        'pagamento'

                        &&

                        movimentacao.formaPagamento ===
                        this.formaPagamentoSelecionada
                    );
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

    private atualizarIndicadores(): void {

        const totalRecebido =
            this.movimentacoes
                .filter(
                    movimentacao =>
                        movimentacao.tipo ===
                        'pagamento'
                )
                .reduce(
                    (total, movimentacao) =>
                        total +
                        movimentacao.valor,
                    0
                );

        const totalFiado =
            this.movimentacoes
                .filter(
                    movimentacao =>
                        movimentacao.tipo ===
                        'fiado'
                )
                .reduce(
                    (total, movimentacao) =>
                        total +
                        movimentacao.valor,
                    0
                );

        const saldoAberto =
            totalFiado -
            totalRecebido;

        const quantidadePagamentos =
            this.movimentacoes
                .filter(
                    movimentacao =>
                        movimentacao.tipo ===
                        'pagamento'
                )
                .length;

        const clientesDevedores =

            new Set(

                this.movimentacoes

                    .filter(
                        movimentacao =>
                            movimentacao.tipo ===
                            'fiado'
                    )

                    .map(
                        movimentacao =>
                            movimentacao.clienteNome
                    )

            ).size;

        const hoje = new Date();

        const recebimentosHoje =
            this.movimentacoes

                .filter(
                    movimentacao =>
                        movimentacao.tipo ===
                        'pagamento'
                )

                .filter(
                    movimentacao => {

                        const dataMovimentacao =
                            new Date(
                                movimentacao.data
                            );

                        return (

                            dataMovimentacao
                                .toDateString()

                            ===

                            hoje.toDateString()

                        );

                    }
                )

                .reduce(
                    (total, movimentacao) =>
                        total +
                        movimentacao.valor,
                    0
                );

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
}