import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { MovimentacaoFinanceira } from '../../core/models/movimentacao-financeira.model';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { SelectInput } from '../../shared/components/select-input/select-input';
import { StatCardCarousel } from '../../shared/components/stat-card-carousel/stat-card-carousel';
import { ExtratoFinanceiroService } from '../../core/services/extrato-financeiro.service';
import { IndicadoresExtrato } from '../../core/models/indicadores-extrato.model';

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

    movimentacoes: MovimentacaoFinanceira[] = [];

    textoBusca = '';

    formaPagamentoSelecionada = 'todos';

    indicadores?: IndicadoresExtrato;


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

                    this.movimentacoes =
                        movimentacoes;

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
}