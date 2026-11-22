import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SplitPanel } from '../../../../shared/components/split-panel/split-panel';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PedidoDeliveryResumo } from '../../../../core/models/pedido-delivery-resumo.model';
import { DeliveryService } from '../../../../core/services/delivery.service';
import { CurrencyPipe } from '@angular/common';


@Component({

    selector: 'app-report-delivery-entregas',
    standalone: true,
    imports: [
        SplitPanel,
        EmptyState,
        CurrencyPipe
    ],
    templateUrl: './report-delivery-entregas.html',
    styleUrl: './report-delivery-entregas.scss'

})
export class ReportDeliveryEntregas {

    constructor(
        private deliveryService: DeliveryService,
        private cdr: ChangeDetectorRef
    ) { }

    @Input()
    resumo: any;

    pedidos: PedidoDeliveryResumo[] = [];

    @Input()
    slugTenant = '';

    @Input()
    periodoSelecionado!:
        | 'hoje'
        | '7dias'
        | '30dias'
        | 'mes'
        | 'todos';

    selectedSection:
        | 'tempo'
        | 'entregues'
        | 'em-entrega'
        | 'atrasados'
        | null
        = null;

    selecionarResumo(
        resumo:
            | 'tempo'
            | 'entregues'
            | 'em-entrega'
            | 'atrasados'
    ): void {

        this.selectedSection = resumo;

        if (resumo === 'entregues') {

            this.carregarPedidos('ENTREGUE');

        }

        if (resumo === 'em-entrega') {

            this.carregarPedidos('EM_ENTREGA');

        }

        if (resumo === 'atrasados') {

            this.carregarPedidosAtrasados();

        }

    }

    get tituloDetalhe(): string {

        switch (this.selectedSection) {

            case 'tempo':
                return '⏱ Tempo Médio de Entrega';

            case 'entregues':
                return '✅ Entregas Concluídas';

            case 'em-entrega':
                return '🛵 Pedidos em Entrega';

            case 'atrasados':
                return '⚠️ Pedidos Atrasados';

            default:
                return '';
        }

    }

    get valorPrincipal(): string {

        switch (this.selectedSection) {

            case 'tempo':
                return `${this.resumo?.tempoMedioEntrega ?? 0} min`;

            case 'entregues':
                return String(
                    this.resumo?.entregasConcluidas ?? 0
                );

            case 'em-entrega':
                return String(
                    this.resumo?.pedidosEmEntrega ?? 0
                );

            case 'atrasados':
                return String(
                    this.resumo?.pedidosAtrasados ?? 0
                );

            default:
                return '-';
        }

    }

    private carregarPedidos(
        status: string
    ): void {

        this.deliveryService
            .listarPedidos(
                this.slugTenant,
                status,
                this.periodoSelecionado
            )
            .subscribe({

                next: pedidos => {

                    this.pedidos = pedidos;

                    this.cdr.detectChanges();

                }

            });

    }

    private carregarPedidosAtrasados(): void {

        this.deliveryService
            .listarPedidos(
                this.slugTenant,
                undefined,
                this.periodoSelecionado
            )
            .subscribe({

                next: pedidos => {

                    this.pedidos =
                        pedidos.filter(
                            pedido => pedido.atrasado
                        );

                    this.cdr.detectChanges();

                }

            });

    }


}