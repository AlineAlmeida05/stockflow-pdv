import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SplitPanel } from '../../../../shared/components/split-panel/split-panel';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { DashboardChart } from '../../../../shared/components/dashboard-chart/dashboard-chart';
import { DeliveryService } from '../../../../core/services/delivery.service';
import { PedidoDeliveryResumo } from '../../../../core/models/pedido-delivery-resumo.model';
import { FormaPagamentoDelivery } from '../../../../core/models/forma-pagamento-delivery.model';

@Component({
    selector: 'app-report-delivery-financeiro',
    standalone: true,
    imports: [
        SplitPanel,
        EmptyState,
        CurrencyPipe,
        DashboardChart
    ],
    templateUrl: './report-delivery-financeiro.html',
    styleUrl: './report-delivery-financeiro.scss'
})
export class ReportDeliveryFinanceiro {

    @Input()
    resumo: any;

    selectedSection:
        | 'faturamento'
        | 'ticket-medio'
        | 'pagamentos'
        | 'entregues'
        | null
        = null;

    @Input()
    periodoSelecionado!:
        'hoje'
        | '7dias'
        | '30dias'
        | 'mes'
        | 'todos';

    @Output()
    periodoSelecionadoChange =
        new EventEmitter<
            'hoje'
            | '7dias'
            | '30dias'
            | 'mes'
            | 'todos'
        >();

    @Input()
    slugTenant = '';

    pedidosEntregues: PedidoDeliveryResumo[] = [];

    formasPagamento: FormaPagamentoDelivery[] = [];

    constructor(
        private deliveryService: DeliveryService,
        private cdr: ChangeDetectorRef
    ) { }

    selecionarResumo(
        resumo:
            | 'faturamento'
            | 'ticket-medio'
            | 'pagamentos'
            | 'entregues'
    ): void {

        this.selectedSection = resumo;

        if (
            resumo === 'faturamento'
            ||
            resumo === 'ticket-medio'
            ||
            resumo === 'entregues'
        ) {

            this.carregarPedidosEntregues();

        }

        if (
            resumo === 'pagamentos'
        ) {

            this.carregarFormasPagamento();

        }

    }

    get ticketMedio(): number {

        const entregues = this.resumo?.entreguesHoje ?? 0;

        const faturamento =
            Number(
                this.resumo?.valorEntregues ?? 0
            );

        if (!entregues) {

            return 0;

        }

        return faturamento / entregues;

    }

    get tituloDetalhe(): string {

        switch (this.selectedSection) {

            case 'faturamento':
                return '💰 Faturamento Delivery';

            case 'ticket-medio':
                return '🎯 Ticket Médio';

            case 'pagamentos':
                return '💳 Formas de Pagamento';

            case 'entregues':
                return '✅ Pedidos Entregues';

            default:
                return '';

        }

    }

    get valorPrincipal(): string {

        switch (this.selectedSection) {

            case 'faturamento':
                return Number(
                    this.resumo?.valorEntregues ?? 0
                ).toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                );

            case 'ticket-medio':
                return this.ticketMedio
                    .toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    );

            case 'entregues':
                return String(
                    this.resumo?.entreguesHoje ?? 0
                );

            case 'pagamentos':
                return 'Em breve';

            default:
                return '-';

        }

    }

    chartOptions = {

        responsive: true,

        maintainAspectRatio: false

    };

    get descricaoPeriodo(): string {

        switch (this.periodoSelecionado) {

            case '7dias':
                return 'Últimos 7 dias';

            case '30dias':
                return 'Últimos 30 dias';

            case 'mes':
                return 'Mês Atual';

            case 'todos':
                return 'Todo período';

            default:
                return 'Hoje';

        }

    }

    alterarPeriodo(
        periodo:
            'hoje'
            | '7dias'
            | '30dias'
            | 'mes'
            | 'todos'
    ) {

        this.periodoSelecionadoChange.emit(
            periodo
        );

    }

    private carregarPedidosEntregues(): void {

        this.deliveryService
            .listarPedidos(
                this.slugTenant,
                'ENTREGUE',
                this.periodoSelecionado
            )
            .subscribe({

                next: pedidos => {

                    this.pedidosEntregues = pedidos;

                    this.cdr.detectChanges();

                }

            });

    }

    get pedidosMaiorValor() {

        return [...this.pedidosEntregues]

            .sort(
                (a, b) =>
                    b.valorTotal
                    - a.valorTotal
            );

    }

    private carregarFormasPagamento(): void {

        this.deliveryService
            .obterFormasPagamento(
                this.slugTenant,
                this.periodoSelecionado
            )
            .subscribe({

                next: response => {

                    this.formasPagamento = response;

                    this.cdr.detectChanges();

                }

            });

    }

    get pagamentosChartData() {

        return {

            labels:

                this.formasPagamento.map(
                    item =>
                        item.formaPagamento
                ),

            datasets: [

                {

                    data:

                        this.formasPagamento.map(
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

}