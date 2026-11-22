import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../core/services/delivery.service';
import { ResumoDashboardDelivery } from '../../core/models/resumo-dashboard-delivery.model';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { Router } from '@angular/router';
import { ReportHeader } from '../../shared/components/report-header/report-header';
import { ReportDeliveryFinanceiro } from './components/report-delivery-financeiro/report-delivery-financeiro';
import { ReportDeliveryCatalogo } from './components/report-delivery-catalogo/report-delivery-catalogo';
import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { interval, Subscription } from 'rxjs';
import { DeliveryEntregasResumo } from '../../core/models/delivery-entregas-resumo.model';
import { ReportDeliveryEntregas } from './components/report-delivery-entregas/report-delivery-entregas';
import { AlertService } from '../../core/services/alert.service';

@Component({
    selector: 'app-delivery-dashboard',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        ReportHeader,
        ReportDeliveryFinanceiro,
        ReportDeliveryCatalogo,
        ReportDeliveryEntregas

    ],
    templateUrl: './delivery-dashboard.html',
    styleUrls: ['./delivery-dashboard.scss']
})

export class DeliveryDashboard implements OnInit {

    resumo?: ResumoDashboardDelivery;

    carregando = false;

    selectedSection: string | null = null;

    produtos: Produto[] = [];

    private refreshSub?: Subscription;

    resumoEntregas?: DeliveryEntregasResumo;

    private totalNovosAnterior = 0;

    private novosAnterior = 0;

    periodoSelecionado:
        'hoje'
        | '7dias'
        | '30dias'
        | 'mes'
        | 'todos'
        = 'hoje';

    abaSelecionada:
        'financeiro'
        | 'catalogo'
        | 'entregas'
        = 'financeiro';

    constructor(
        private deliveryService: DeliveryService,
        private produtoService: ProdutoService,
        private cdr: ChangeDetectorRef,
        private tenantContextService: TenantContextService,
        private router: Router,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {

        this.carregarResumo();

        this.carregarResumoEntregas();

        this.refreshSub =
            interval(20000)
                .subscribe(() => {

                    this.carregarResumo();

                    this.carregarResumoEntregas();

                });

        this.carregarProdutos();

    }

    ngOnDestroy(): void {

        this.refreshSub?.unsubscribe();

    }

    carregarResumo(): void {

        this.carregando = true;

        this.deliveryService
            .obterResumo(
                this.slugTenant,
                this.periodoSelecionado
            )
            .subscribe({

                next: (response) => {

                    if (
                        this.novosAnterior > 0
                        &&
                        response.novos > this.novosAnterior
                    ) {

                        this.alertService.info(
                            '🔔 Novo pedido recebido!'
                        );

                    }

                    this.novosAnterior = response.novos;

                    this.resumo = response;

                    this.carregando = false;

                    this.cdr.detectChanges();

                },

                error: () => {

                    this.carregando = false;

                }

            });

    }

    get slugTenant(): string {

        return this
            .tenantContextService
            .tenantAtual
            ?.slug
            ?? 'stockflowpdv';

    }

    abrirHistoricoVendas(): void {

        this.router.navigate(
            ['/historico-de-vendas']
        );

    }

    abrirExtratoFinanceiro(): void {

        this.router.navigate(
            ['/extrato-financeiro']
        );

    }

    abrirPedidos(): void {

        this.router.navigate(
            ['/delivery-pedidos']
        );

    }

    abrirCatalogo(): void {

        this.router.navigate(
            ['/delivery-catalogo']
        );

    }

    private carregarProdutos(): void {

        this.produtoService
            .listar()
            .subscribe({

                next: produtos => {

                    this.produtos = produtos;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar produtos',
                        erro
                    );

                }

            });

    }

    get produtosSemEstoque(): Produto[] {

        return this.produtos.filter(
            produto =>
                produto.estoqueAtual === 0
        );

    }

    get produtosEstoqueBaixo(): Produto[] {

        return this.produtos.filter(
            produto =>
                produto.estoqueAtual > 0
                &&
                produto.estoqueAtual <=
                produto.estoqueMinimo
        );

    }

    get produtosPromocionais(): Produto[] {

        return this.produtos.filter(
            produto =>
                produto.promocaoAtiva
        );

    }

    alterarPeriodo(
        periodo:
            | 'hoje'
            | '7dias'
            | '30dias'
            | 'mes'
            | 'todos'
    ): void {

        this.periodoSelecionado = periodo;

        this.carregarResumo();

        this.carregarResumoEntregas();

    }

    carregarResumoEntregas(): void {

        this.deliveryService
            .obterResumoEntregas(
                this.slugTenant,
                this.periodoSelecionado
            )
            .subscribe({

                next: response => {

                    this.resumoEntregas = response;

                    this.cdr.detectChanges();

                }

            });

    }

}