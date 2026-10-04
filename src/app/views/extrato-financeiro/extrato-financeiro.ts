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
        StatCard
    ],
    templateUrl: './extrato-financeiro.html',
    styleUrl: './extrato-financeiro.scss'
})
export class ExtratoFinanceiro

    implements OnInit {

    movimentacoes: MovimentacaoFinanceira[] = [];

    textoBusca = '';

    formaPagamentoSelecionada = 'todos';

    indicadores?: IndicadoresExtrato;

    paginaAtual = 1;

    itensPorPagina = '10';

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

    private carregarIndicadores(): void {

        this.extratoFinanceiroService
            .obterIndicadores()
            .subscribe({

                next: indicadores => {

                    this.indicadores =
                        indicadores;

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

                    console.log(
                        'MOVIMENTACOES',
                        movimentacoes
                    );

                    this.movimentacoes = movimentacoes;

                    this.atualizarIndicadores();

                    this.cdr.detectChanges();

                    setTimeout(() => {

                        this.searchInput?.focar();

                    });

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

                const atendeBusca =

                    (
                        movimentacao.clienteNome
                        ?? ''
                    )
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

    get movimentacoesPaginadas() {

        const inicio =

            (this.paginaAtual - 1)
            * Number(this.itensPorPagina);

        const fim =

            inicio
            + Number(this.itensPorPagina);

        return this
            .movimentacoesFiltradas
            .slice(
                inicio,
                fim
            );

    }

    get totalPaginas() {

        return Math.max(

            1,

            Math.ceil(

                this.movimentacoesFiltradas.length
                /
                Number(this.itensPorPagina)

            )

        );

    }

    proximaPagina(): void {

        if (
            this.paginaAtual <
            this.totalPaginas
        ) {

            this.paginaAtual++;

        }

    }

    paginaAnterior(): void {

        if (
            this.paginaAtual > 1
        ) {

            this.paginaAtual--;

        }

    }

    reiniciarPaginacao(): void {

        this.paginaAtual = 1;

    }

    get inicioPagina(): number {

        return this.movimentacoesFiltradas.length === 0

            ? 0

            : (
                (this.paginaAtual - 1)
                * Number(this.itensPorPagina)
            ) + 1;

    }

    get fimPagina(): number {

        return Math.min(

            this.paginaAtual
            * Number(this.itensPorPagina),

            this.movimentacoesFiltradas.length

        );

    }

    alterarItensPorPagina(): void {

        this.paginaAtual = 1;

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
            },

            {
                title: 'Movimentações',
                value: this.movimentacoes.length,
                variant: 'info'
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