import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Venda } from '../../core/models/venda.model';

import { VendaService } from '../../core/services/venda.service';

import { FormsModule } from '@angular/forms';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { StatCardCarousel } from '../../shared/components/stat-card-carousel/stat-card-carousel';
import { SelectInput } from '../../shared/components/select-input/select-input';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { AlertService } from '../../core/services/alert.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { ExpandableCard } from '../../shared/components/expandable-card/expandable-card';
import { ChangeDetectorRef } from '@angular/core';

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
        StatCardCarousel,
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

    opcoesPagamento = [
        {
            value: '',
            label: 'Todas'
        },
        {
            value: 'pix',
            label: 'PIX'
        },
        {
            value: 'dinheiro',
            label: 'Dinheiro'
        },
        {
            value: 'debito',
            label: 'Débito'
        },
        {
            value: 'credito',
            label: 'Crédito'
        },
        {
            value: 'fiado',
            label: 'Fiado'
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

        return this.vendas.filter(
            venda => {

                const pagamentoOk =
                    !this.filtroPagamento ||
                    venda.formaPagamento ===
                    this.filtroPagamento;


                return pagamentoOk;

            }
        );

    }

    get totalVendas(): number {

        return this.vendasFiltradas.length;

    }

    get faturamentoTotal(): number {

        return Number(
            this.vendasFiltradas
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

        this.vendaService
            .buscarPorId(venda.id)
            .subscribe({

                next: vendaDetalhada => {

                    console.log(vendaDetalhada);

                    this.vendaSelecionada =
                        vendaDetalhada;

                    this.mostrarCancelamento =
                        false;

                    this.motivoCancelamento =
                        '';

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

    executarCancelamento(): void {

        if (
            !this.motivoCancelamento.trim()
        ) {

            this.alertService.warning(
                'Informe o motivo do cancelamento.'
            );

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

                    this.mostrarCancelamento = false;

                    this.motivoCancelamento = '';

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

    get cardsHistorico(): {
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
        status: string
    ): 'success' | 'danger' {

        return status === 'cancelada'
            ? 'danger'
            : 'success';

    }

    abrirConfirmacaoCancelamento(): void {

        if (
            !this.motivoCancelamento.trim()
        ) {

            this.alertService.warning(
                'Informe o motivo do cancelamento.'
            );

            return;

        }

        this.confirmDialogService.open({

            title: 'Cancelar Venda',

            message:
                'Deseja realmente cancelar esta venda?',

            type: 'danger',

            confirmText:
                'Cancelar Venda',

            onConfirm: () => {

                this.executarCancelamento();

            }

        });

    }

    obterTextoStatus(
        status: string
    ): string {

        return status === 'cancelada'
            ? 'Cancelada'
            : 'Finalizada';

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


}