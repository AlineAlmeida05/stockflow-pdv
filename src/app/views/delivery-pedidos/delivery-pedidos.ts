import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { DataTable } from '../../shared/components/data-table/data-table';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../core/services/delivery.service';
import { PedidoDeliveryResumo } from '../../core/models/pedido-delivery-resumo.model';
import { PedidoDeliveryDetalhe } from '../../core/models/pedido-delivery-detalhe.model';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { NgClass } from '@angular/common';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { ResumoDashboardDelivery } from '../../core/models/resumo-dashboard-delivery.model';

@Component({
    selector: 'app-delivery-pedidos',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        DataTable,
        EmptyState,
        SearchInput,
        Toolbar,
        FormsModule,
        SplitPanel,
        NgClass,
        StatCard,
    ],
    templateUrl: './delivery-pedidos.html',
    styleUrl: './delivery-pedidos.scss'
})
export class DeliveryPedidos implements OnInit {

    pedidos: PedidoDeliveryResumo[] = [];

    pedidosEntreguesHoje: PedidoDeliveryResumo[] = [];

    textoBusca = '';

    pedidoSelecionado?: PedidoDeliveryDetalhe;

    mostrarDetalhes = false;

    abaSelecionada: 'OPERACAO' | 'ENTREGUES' | 'HISTORICO' = 'OPERACAO';

    statusFiltro = '';

    resumo?: ResumoDashboardDelivery;

    colunasPedidosOperacao = [
        {
            field: 'numero',
            header: 'Pedido'
        },
        {
            field: 'clienteNome',
            header: 'Cliente'
        },
        {
            field: 'status',
            header: 'Status',
            type: 'badge' as const
        },
        {
            field: 'horaPedido',
            header: 'Hora',
            align: 'center' as const
        }
    ];

    colunasPedidosEntregues = [
        {
            field: 'numero',
            header: 'Pedido'
        },
        {
            field: 'clienteNome',
            header: 'Cliente'
        },
        {
            field: 'status',
            header: 'Status',
            type: 'badge' as const
        },
        {
            field: 'valorTotal',
            header: 'Valor',
            type: 'currency' as const,
            align: 'center' as const
        },
        {
            field: 'horaPedido',
            header: 'Hora',
            align: 'center' as const
        }
    ];

    colunasPedidosHistorico = [
        {
            field: 'numero',
            header: 'Pedido'
        },
        {
            field: 'clienteNome',
            header: 'Cliente'
        },
        {
            field: 'status',
            header: 'Status',
            type: 'badge' as const
        },
        {
            field: 'formaPagamento',
            header: 'Pagamento'
        },
        {
            field: 'valorTotal',
            header: 'Valor',
            type: 'currency' as const
        },
        {
            field: 'horaPedido',
            header: 'Hora'
        }
    ];

    indicadorOperacaoSelecionado:
        'NOVOS'
        | 'SEPARANDO'
        | 'PRONTOS'
        | 'EM_ENTREGA'
        | 'ENTREGUES'
        | 'CANCELADOS'
        = 'NOVOS';

    periodoHistorico:
        'hoje'
        | '7dias'
        | '30dias'
        | 'mes'
        | 'todos'
        = '30dias';

    constructor(
        private deliveryService: DeliveryService,
        private cdr: ChangeDetectorRef,
        private tenantContextService: TenantContextService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {

        this.route.queryParams.subscribe(
            params => {

                this.statusFiltro = params['status'];

                this.carregarPedidos();

                this.carregarEntreguesHoje();

                this.carregarResumo();

                this.cdr.detectChanges();

            }
        );

    }

    carregarPedidos(): void {

        let periodo =
            this.abaSelecionada === 'HISTORICO'
                ? this.periodoHistorico
                : 'todos';

        this.deliveryService
            .listarPedidos(
                this.slugTenant,
                this.statusFiltro || undefined,
                periodo
            )
            .subscribe({

                next: pedidos => {

                    this.pedidos = pedidos;

                    this.cdr.detectChanges();

                }

            });

    }

    get pedidosFiltrados(): PedidoDeliveryResumo[] {

        const busca = this.textoBusca.toLowerCase();

        return this.pedidos.filter(
            pedido =>
                pedido.numero
                    .toLowerCase()
                    .includes(busca)
                ||
                (pedido.clienteNome ?? '')
                    .toLowerCase()
                    .includes(busca)
        );

    }

    visualizarPedido(
        pedido: unknown
    ): void {

        const pedidoSelecionado = pedido as PedidoDeliveryResumo;

        this.carregarDetalhePedido(
            pedidoSelecionado.id
        );

    }

    mostrarEndereco(): boolean {

        if (!this.pedidoSelecionado) {
            return false;
        }

        return [
            'PRONTO_PARA_ENTREGA',
            'EM_ENTREGA',
            'ENTREGUE'
        ].includes(
            this.pedidoSelecionado.status
        );

    }

    avancarStatus(): void {

        if (!this.pedidoSelecionado) {
            return;
        }

        const proximoStatus =
            this.obterProximoStatus(
                this.pedidoSelecionado.status
            );

        if (!proximoStatus) {
            return;
        }

        this.deliveryService
            .atualizarStatus(
                this.slugTenant,
                this.pedidoSelecionado.id,
                proximoStatus
            )
            .subscribe({

                next: () => {

                    this.carregarPedidos();

                    this.carregarResumo();

                    this.carregarEntreguesHoje();

                    this.carregarDetalhePedido(
                        this.pedidoSelecionado!.id
                    );

                    this.cdr.detectChanges();

                }

            });

    }

    obterProximoStatus(
        status: string
    ): string | null {

        switch (status) {

            case 'NOVO':
                return 'SEPARANDO';

            case 'SEPARANDO':
                return 'PRONTO_PARA_ENTREGA';

            case 'PRONTO_PARA_ENTREGA':
                return 'EM_ENTREGA';

            case 'EM_ENTREGA':
                return 'ENTREGUE';

            default:
                return null;
        }

    }

    mostrarValor(): boolean {

        return this.pedidoSelecionado?.status === 'ENTREGUE';

    }

    mostrarHorarioSaida(): boolean {

        return this.pedidoSelecionado?.status
            === 'EM_ENTREGA'
            ||
            this.pedidoSelecionado?.status
            === 'ENTREGUE';

    }

    isPedidoEmSeparacao(): boolean {

        return this.pedidoSelecionado?.status === 'NOVO'
            || this.pedidoSelecionado?.status === 'SEPARANDO';

    }

    get pedidosOperacao(): PedidoDeliveryResumo[] {

        return this.pedidosFiltrados.filter(
            pedido =>
                pedido.status !== 'ENTREGUE'
                &&
                pedido.status !== 'CANCELADO'
        );

    }

    isEntregue(): boolean {

        return this.pedidoSelecionado?.status === 'ENTREGUE';

    }

    isEmOperacao(): boolean {

        return this.pedidoSelecionado?.status !== 'ENTREGUE';

    }

    obterClasseStatus(): string {

        switch (
        this.pedidoSelecionado?.status
        ) {

            case 'NOVO':
                return 'status-info';

            case 'SEPARANDO':
                return 'status-warning';

            case 'PRONTO_PARA_ENTREGA':
                return 'status-ready';

            case 'EM_ENTREGA':
                return 'status-delivery';

            case 'ENTREGUE':
                return 'status-success';

            case 'CANCELADO':
                return 'status-danger';

            default:
                return '';
        }

    }

    obterTextoAcao(): string {

        switch (
        this.pedidoSelecionado?.status
        ) {

            case 'NOVO':
                return 'Iniciar Separação';

            case 'SEPARANDO':
                return 'Pedido Separado';

            case 'PRONTO_PARA_ENTREGA':
                return 'Enviar para Entrega';

            case 'EM_ENTREGA':
                return 'Marcar como Entregue';

            default:
                return '';

        }

    }

    obterClasseBotaoStatus(): string {

        switch (
        this.pedidoSelecionado?.status
        ) {

            case 'NOVO':
                return 'btn-primary';

            case 'SEPARANDO':
                return 'btn-warning';

            case 'PRONTO_PARA_ENTREGA':
                return 'btn-ready';

            case 'EM_ENTREGA':
                return 'btn-delivery';

            default:
                return 'btn-primary';

        }

    }

    formatarNumeroPedido(
        numero: string
    ): string {

        const partes = numero.split('-');

        return `#${partes[1]}`;

    }

    get slugTenant(): string {

        return this
            .tenantContextService
            .tenantAtual
            ?.slug
            ?? 'stockflowpdv';

    }

    private carregarDetalhePedido(
        pedidoId: string
    ): void {

        this.deliveryService
            .buscarPedido(
                this.slugTenant,
                pedidoId
            )
            .subscribe({

                next: detalhe => {

                    this.pedidoSelecionado = detalhe;

                    this.mostrarDetalhes = true;

                    this.cdr.detectChanges();

                }

            });

    }

    abrirPedidosPorStatus(
        status: string
    ): void {

        this.router.navigate(
            ['/delivery-pedidos'],
            {
                queryParams: {
                    status
                }
            }
        );

    }

    private carregarResumo(): void {

        this.deliveryService
            .obterResumo(
                this.slugTenant,
                'todos'
            )
            .subscribe({

                next: resumo => {

                    this.resumo = resumo;

                    this.cdr.detectChanges();

                }

            });

    }

    get pedidosHistorico(): PedidoDeliveryResumo[] {

        return this.pedidosFiltrados.filter(
            pedido =>
                pedido.status === 'ENTREGUE'
                ||
                pedido.status === 'CANCELADO'
        );

    }

    alterarPeriodoHistorico(
        periodo:
            | 'hoje'
            | '7dias'
            | '30dias'
            | 'mes'
            | 'todos'
    ): void {

        this.periodoHistorico = periodo;

        this.carregarPedidos();

    }

    selecionarAba(
        aba: 'OPERACAO' | 'ENTREGUES' | 'HISTORICO'
    ): void {

        this.abaSelecionada = aba;

        this.statusFiltro = '';

        this.pedidoSelecionado = undefined;

        this.mostrarDetalhes = false;

        if (aba !== 'ENTREGUES') {
            this.carregarPedidos();
        }

    }


    private carregarEntreguesHoje(): void {

        this.deliveryService
            .listarPedidos(
                this.slugTenant,
                'ENTREGUE',
                'hoje'
            )
            .subscribe({

                next: pedidos => {

                    this.pedidosEntreguesHoje = pedidos;

                    this.cdr.detectChanges();

                }

            });

    }

    get pedidosExibidos(): PedidoDeliveryResumo[] {

        switch (this.abaSelecionada) {

            case 'OPERACAO':
                return this.pedidosOperacao;

            case 'ENTREGUES':
                return this.pedidosEntreguesHoje;

            case 'HISTORICO':
                return this.pedidosHistorico;

            default:
                return [];

        }

    }


}