import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Venda } from '../../core/models/venda.model';
import { VendaService } from '../../core/services/venda.service';
import { FormsModule } from '@angular/forms';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { SelectInput } from '../../shared/components/select-input/select-input';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { AlertService } from '../../core/services/alert.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { ExpandableCard } from '../../shared/components/expandable-card/expandable-card';
import { ChangeDetectorRef } from '@angular/core';
import { FORMA_PAGAMENTO_ICONS, FORMA_PAGAMENTO_OPTIONS, FORMA_PAGAMENTO_PADRAO, FormaPagamentoTela } from '../../core/models/forma-pagamento.model';
import { VENDA_STATUS_LABELS, VendaStatus } from '../../core/models/venda-status.model';
import { FormaPagamento } from '../../core/models/venda-request.model';
import { HistoricoCard } from '../../core/models/historico-card.model';

@Component({
    selector: 'app-historico-de-vendas',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        DatePipe,
        FormsModule,
        PageTitle,
        EmptyState,
        SplitPanel,
        SelectInput,
        StatusBadge,
        ExpandableCard,
        UpperCasePipe

    ],
    templateUrl: './historico-de-vendas.html',
    styleUrl: './historico-de-vendas.scss'
})

export class HistoricoDeVendas
    implements OnInit {

    vendas: Venda[] = [];

    vendaSelecionada?: Venda;

    filtroPagamento = '';

    mostrarCancelamento = false;

    motivoCancelamento = '';

    filtroStatus: VendaStatus | '' = '';

    opcoesPagamento = [
        {
            value: '',
            label: 'Todas'
        },
        ...FORMA_PAGAMENTO_OPTIONS
    ];

    opcoesStatus = [
        {
            value: '',
            label: 'Todos'
        },
        {
            value: 'finalizada',
            label: 'Finalizadas'
        },
        {
            value: 'cancelada',
            label: 'Canceladas'
        }
    ];

    constructor(
        private vendaService: VendaService,
        private alertService: AlertService,
        private confirmDialogService: ConfirmDialogService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.carregarVendas();

    }

    get vendasFiltradas(): Venda[] {

        return this.vendas.filter(venda => {

            const pagamentoOk = !this.filtroPagamento ||
                venda.formaPagamento === this.filtroPagamento;

            const statusOk = !this.filtroStatus ||
                venda.status === this.filtroStatus;

            return pagamentoOk && statusOk;

        });

    }

    get totalVendas(): number {

        return this.vendasFiltradas.length;

    }

    get faturamentoTotal(): number {

        return Number(
            this.vendasFiltradas
                .filter(
                    venda =>
                        venda.status === 'finalizada'
                )
                .reduce(
                    (total, venda) =>
                        total + venda.valorTotal,
                    0
                )
                .toFixed(2)
        );

    }

    get ticketMedio(): number {

        if (this.totalVendas === 0) {
            return 0;
        }

        return Number(
            (
                this.faturamentoTotal /
                this.totalVendas
            ).toFixed(2)
        );

    }

    get totalFiados(): number {

        return this.vendasFiltradas
            .filter(
                venda =>
                    venda.formaPagamento === 'fiado'
            )
            .reduce(
                (total, venda) =>
                    total + venda.valorTotal,
                0
            );

    }

    selecionarVenda(
        venda: Venda
    ): void {

        this.carregarDetalhesVenda(
            venda.id
        );
    }

    executarCancelamento(): void {

        if (!this.validarCancelamento()) {
            return;
        }

        if (!this.vendaSelecionada) {
            return;
        }

        this.vendaService
            .cancelar(
                this.vendaSelecionada.id,
                this.motivoCancelamento
            )
            .subscribe({

                next: () => {

                    this.alertService.success(
                        'Venda cancelada com sucesso.'
                    );

                    this.carregarVendas();

                    this.atualizarVendaCancelada();

                    this.limparCancelamento();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                    this.alertService.error(
                        erro?.error?.message ??
                        'Erro ao cancelar venda.'
                    );

                }

            });

    }

    get cardsHistorico():
        HistoricoCard[] {

        return [

            {
                title: 'Vendas',
                value: this.totalVendas,
                variant: 'info'
            },

            {
                title: 'Faturamento',
                value: this.faturamentoTotal.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                ),
                variant: 'success'
            },

            {
                title: 'Ticket Médio',
                value: this.ticketMedio.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                ),
                variant: 'warning'
            },

            {
                title: 'Fiados',
                value: this.totalFiados.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                ),
                variant: 'danger'
            },
            {
                title: 'Canceladas',
                value: this.totalCanceladas,
                variant: 'danger'
            }

        ];

    }

    obterVariantStatus(
        status: VendaStatus
    ): 'success' | 'danger' {

        return status === 'cancelada'
            ? 'danger'
            : 'success';

    }

    abrirConfirmacaoCancelamento(): void {

        if (!this.vendaSelecionada) {
            return;
        }

        if (!this.validarCancelamento()) {
            return;
        }

        this.confirmDialogService.open({

            title: 'Cancelar Venda',

            message: `Deseja realmente cancelar a venda de ${this.vendaSelecionada.valorTotal
                .toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                )} realizada por ${this.vendaSelecionada.usuarioNome}?`,

            type: 'danger',

            confirmText: 'Cancelar Venda',

            onConfirm: () => {

                this.executarCancelamento();

            }

        });

    }

    obterTextoStatus(
        status: VendaStatus
    ): string {

        return VENDA_STATUS_LABELS[
            status
        ];
    }

    carregarVendas(): void {

        this.vendaService
            .listar()
            .subscribe({

                next: vendas => {

                    this.vendas =
                        vendas.sort(
                            (a, b) =>
                                new Date(
                                    b.dataVenda
                                ).getTime()
                                -
                                new Date(
                                    a.dataVenda
                                ).getTime()
                        );

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    get totalCanceladas(): number {

        return this.vendas.filter(
            venda =>
                venda.status === 'cancelada'
        ).length;

    }

    obterIconePagamento(
        formaPagamento: FormaPagamento | FormaPagamentoTela
    ): string {

        if (formaPagamento === FORMA_PAGAMENTO_PADRAO) {
            return '';
        }

        return FORMA_PAGAMENTO_ICONS[
            formaPagamento
        ];
    }

    podeCancelarVenda(
        venda: Venda
    ): boolean {

        const dataVenda = new Date(venda.dataVenda);

        const agora = new Date();

        const limite = 24 * 60 * 60 * 1000;

        return (
            agora.getTime() -
            dataVenda.getTime()
        ) <= limite;

    }

    private limparCancelamento(): void {

        this.mostrarCancelamento = false;

        this.motivoCancelamento = '';
    }

    private validarCancelamento(): boolean {

        if (!this.motivoCancelamento.trim()) {

            this.alertService.warning(
                'Informe o motivo do cancelamento.'
            );

            return false;
        }

        return true;
    }

    private carregarDetalhesVenda(
        vendaId: string
    ): void {

        this.vendaService
            .buscarPorId(vendaId)
            .subscribe({

                next: vendaDetalhada => {

                    this.vendaSelecionada = vendaDetalhada;

                    setTimeout(() => {

                        document
                            .querySelector(
                                '.detalhes-panel'
                            )
                            ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });

                    });

                    this.limparCancelamento();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                    this.alertService.error(
                        'Erro ao carregar detalhes da venda.'
                    );

                }

            });
    }

    private atualizarVendaCancelada(): void {

        if (!this.vendaSelecionada) {
            return;
        }

        this.vendaSelecionada = {
            ...this.vendaSelecionada,
            status: 'cancelada',
            motivoCancelamento:
                this.motivoCancelamento
        };
    }
}