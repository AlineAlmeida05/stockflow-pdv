import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tenant } from '../../core/models/tenant.model';
import { TenantService } from '../../core/services/tenant.service';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { DataTable } from '../../shared/components/data-table/data-table';
import { AlertService } from '../../core/services/alert.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { TenantCreateRequest } from '../../core/requests/tenant-create-request';
import { TenantUpdateRequest } from '../../core/requests/tenant-update-request';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { ImpersonacaoService } from '../../core/services/impersonacao.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { STORAGE_KEYS } from '../../core/constants/storage.constants';
@Component({
    selector: 'app-tenants',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MainLayout,
        PageTitle,
        DataTable,
        EmptyState,
        SearchInput,
        Toolbar,
        SplitPanel
    ],
    templateUrl: './tenants.html',
    styleUrl: './tenants.scss'
})
export class Tenants implements OnInit {

    tenants: Tenant[] = [];

    novoNome = '';

    novoSlug = '';

    novoCodigoTenant = '';

    novoLogoUrl = '';

    novoFaviconUrl = '';

    novaCorPrimaria = '';

    novaCorSecundaria = '';

    novoResponsavel = '';

    novoEmail = '';

    novaCidade = '';

    novaRazaoSocial = '';

    novoCnpj = '';

    novoTelefone = '';

    novoEndereco = '';

    novoUf = '';

    novoDeliveryHabilitado = false;

    salvando = false;

    tenantEditando: Tenant | null = null;

    modoEdicao = false;

    modoVisualizacao = false;

    mostrarFormulario = false;

    textoBusca = '';

    novoAtivo = true;

    mostrarPainel = false;

    abaSelecionada:
        'informacoes'
        | 'configuracoes'
        = 'informacoes';

    colunasTenants: {
        field: string;
        header: string;
        type?: 'text' | 'badge' | 'currency' | 'date' | 'toggle';
    }[] = [
            {
                field: 'nome',
                header: 'Nome'
            },
            {
                field: 'responsavel',
                header: 'Responsável'
            },
            {
                field: 'status',
                header: 'Controle',
                type: 'toggle'
            }
        ];

    constructor(
        private tenantService: TenantService,
        private alertService: AlertService,
        private tenantContextService: TenantContextService,
        private confirmDialogService: ConfirmDialogService,
        private impersonacaoService: ImpersonacaoService,
        private authStateService: AuthStateService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.carregarTenants();

    }

    private limparFormulario(): void {

        this.novoNome = '';
        this.novoSlug = '';
        this.novoCodigoTenant = '';
        this.novoLogoUrl = '';
        this.novoFaviconUrl = '';
        this.novaCorPrimaria = '';
        this.novaCorSecundaria = '';
        this.novoResponsavel = '';
        this.novoEmail = '';
        this.novaCidade = '';
        this.novoAtivo = true;
        this.novaRazaoSocial = '';
        this.novoCnpj = '';
        this.novoTelefone = '';
        this.novoEndereco = '';
        this.novoUf = '';
        this.novoDeliveryHabilitado = false;
    }

    private obterDadosTenant() {

        return {

            nome: this.novoNome,
            razaoSocial: this.novaRazaoSocial,
            cnpj: this.novoCnpj,
            responsavel: this.novoResponsavel,
            email: this.novoEmail,
            telefone: this.novoTelefone,
            endereco: this.novoEndereco,
            cidade: this.novaCidade,
            uf: this.novoUf,
            ativo: this.novoAtivo,
            slug: this.novoSlug,
            codigoTenant: this.novoCodigoTenant,
            logoUrl: this.novoLogoUrl,
            faviconUrl: this.novoFaviconUrl,
            corPrimaria: this.novaCorPrimaria,
            corSecundaria: this.novaCorSecundaria,
            deliveryHabilitado: this.novoDeliveryHabilitado

        };

    }

    private preencherFormulario(
        tenant: Tenant
    ): void {

        this.novoNome = tenant.nome ?? '';
        this.novoSlug = tenant.slug ?? '';
        this.novoCodigoTenant = tenant.codigoTenant ?? '';
        this.novoLogoUrl = tenant.logoUrl ?? '';
        this.novoFaviconUrl = tenant.faviconUrl ?? '';
        this.novaCorPrimaria = tenant.corPrimaria ?? '';
        this.novaCorSecundaria = tenant.corSecundaria ?? '';
        this.novoResponsavel = tenant.responsavel ?? '';
        this.novoEmail = tenant.email ?? '';
        this.novaCidade = tenant.cidade ?? '';
        this.novoAtivo = tenant.ativo ?? true;
        this.novaRazaoSocial = tenant.razaoSocial ?? '';
        this.novoCnpj = tenant.cnpj ?? '';
        this.novoTelefone = tenant.telefone ?? '';
        this.novoEndereco = tenant.endereco ?? '';
        this.novoUf = tenant.uf ?? '';
        this.novoDeliveryHabilitado = tenant.deliveryHabilitado ?? false;

    }

    private criarTenant(

        request: TenantCreateRequest,
        loadingToast: ReturnType<AlertService['loading']>

    ): void {

        this.tenantService
            .salvar(request)
            .subscribe({

                next: (tenantCriado) => {

                    this.tenants = [
                        ...this.tenants,
                        tenantCriado
                    ];

                    this.limparFormulario();

                    this.cdr.detectChanges();

                    this.alertService.updateToast(
                        loadingToast.id,
                        'Tenant criado com sucesso.',
                        'success'
                    );

                    this.salvando = false;


                },

                error: () => {

                    this.alertService.updateToast(
                        loadingToast.id,
                        'Erro ao criar tenant.',
                        'error'
                    );

                    this.salvando = false;
                }

            });

    }

    private atualizarTenantExistente(

        tenantId: string,
        request: TenantUpdateRequest,
        loadingToast: ReturnType<AlertService['loading']>

    ): void {
        this.tenantService
            .atualizar(
                tenantId,
                request
            )
            .subscribe({
                next: (tenantAtualizado) => {

                    this.tenants =
                        this.tenants.map(
                            tenant =>
                                tenant.id === tenantAtualizado.id
                                    ? tenantAtualizado
                                    : tenant
                        );

                    this.cdr.detectChanges();

                    this.alertService.updateToast(
                        loadingToast.id,
                        'Tenant atualizado com sucesso.',
                        'success'
                    );

                    this.salvando = false;
                    this.modoEdicao = false;
                    this.tenantEditando = null;
                    this.novoAtivo = true;
                    this.limparFormulario();

                },

                error: () => {

                    this.alertService.updateToast(
                        loadingToast.id,
                        'Erro ao atualizar tenant.',
                        'error'
                    );

                    this.salvando = false;
                }

            });
    }

    salvarTenant(): void {

        if (!this.novoNome.trim()) {

            this.alertService.warning(
                'Informe o nome da adega.'
            );

            return;

        }

        this.salvando = true;

        const loadingToast =
            this.alertService.loading(
                'Criando tenant...'
            );

        const request: TenantCreateRequest = this.obterDadosTenant();

        this.criarTenant(
            request,
            loadingToast
        );

    }

    carregarTenants(): void {

        this.tenantService
            .listar()
            .subscribe({

                next: (tenants) => {

                    this.tenants = tenants;

                    this.cdr.detectChanges();
                },

                error: (erro) => {

                    console.error(
                        'Erro ao carregar tenants:',
                        erro
                    );

                }

            });

    }

    atualizarTenant(): void {

        if (
            !this.tenantEditando ||
            !this.tenantEditando.id
        ) {

            return;

        }

        this.salvando = true;

        const loadingToast =
            this.alertService.loading(
                'Atualizando tenant...'
            );

        const request: TenantUpdateRequest = this.obterDadosTenant();

        this.atualizarTenantExistente(
            this.tenantEditando.id,
            request,
            loadingToast
        );

    }

    cancelarEdicao(): void {

        this.mostrarPainel = false;

        this.mostrarFormulario = false;

        this.modoVisualizacao = false;

        this.modoEdicao = false;

        this.tenantEditando = null;

        this.abaSelecionada = 'informacoes';

        this.limparFormulario();

    }


    novoTenant(): void {

        this.mostrarPainel = true;

        this.mostrarFormulario = true;

        this.modoVisualizacao = false;

        this.modoEdicao = false;

        this.tenantEditando = null;

        this.abaSelecionada = 'informacoes';

        this.limparFormulario();

    }

    get tenantsTabela(): unknown[] {

        return this.tenants.map(
            tenant => ({

                ...tenant,

                status:
                    tenant.ativo
                        ? 'Ativo'
                        : 'Inativo'

            })
        );

    }

    get tenantsFiltrados(): unknown[] {

        const filtro =
            this.textoBusca
                .toLowerCase()
                .trim();

        return this.tenantsTabela.filter(
            tenant =>
                !filtro ||
                String(
                    (tenant as any).nome
                )
                    .toLowerCase()
                    .includes(filtro)
        );

    }

    gerarSlug(): void {

        if (this.modoEdicao) {
            return;
        }

        this.novoSlug =
            this.novoNome
                .toLowerCase()
                .normalize('NFD')
                .replace(
                    /[\u0300-\u036f]/g,
                    ''
                )
                .replace(
                    /[^a-z0-9\s-]/g,
                    ''
                )
                .trim()
                .replace(
                    /\s+/g,
                    '-'
                );

    }

    gerarUrlTenant(
        tenant: Tenant
    ): string {

        return `/${tenant.slug}`;

    }

    get tenantAtual(): Tenant | null {

        return this
            .tenantContextService
            .tenantAtual;

    }

    gerarCodigoTenant(): void {

        if (this.modoEdicao) {
            return;
        }

        const palavras =
            this.novoNome
                .trim()
                .split(' ')
                .filter(p => p);

        if (palavras.length >= 2) {

            this.novoCodigoTenant =
                (
                    palavras[0][0] +
                    palavras[1][0] +
                    palavras[1][1]
                )
                    .toUpperCase();

            return;
        }

        this.novoCodigoTenant =
            this.novoNome
                .substring(0, 3)
                .toUpperCase();

    }

    visualizarTenant(
        tenant: Tenant
    ): void {

        if (!tenant.id) {
            return;
        }

        this.carregarTenantPorId(
            tenant.id
        );

    }

    habilitarEdicao(): void {

        this.abaSelecionada = 'informacoes';
        this.modoVisualizacao = false;
        this.modoEdicao = true;

    }

    alternarStatusTenant(
        tenant: Tenant
    ): void {

        const atualizado = {
            ...tenant,
            ativo: !tenant.ativo
        };

        this.confirmDialogService.open({
            title:
                tenant.ativo
                    ? 'Desativar Tenant'
                    : 'Ativar Tenant',

            message:
                tenant.ativo
                    ? `Deseja realmente desativar o tenant "${tenant.nome}"?`
                    : `Deseja realmente ativar o tenant "${tenant.nome}"?`,

            type:
                tenant.ativo
                    ? 'warning'
                    : 'info',

            confirmText:
                tenant.ativo
                    ? 'Desativar'
                    : 'Ativar',
            cancelText: 'Cancelar',

            onConfirm: () => {

                const loadingToast =
                    this.alertService.loading(
                        tenant.ativo
                            ? 'Desativando tenant...'
                            : 'Ativando tenant...'
                    );

                this.tenantService
                    .atualizar(
                        tenant.id!,
                        atualizado
                    )
                    .subscribe({
                        next: () => {

                            this.cdr.detectChanges();

                            this.alertService.updateToast(
                                loadingToast.id,
                                tenant.ativo
                                    ? 'Tenant desativado com sucesso.'
                                    : 'Tenant ativado com sucesso.',
                                'success'
                            );

                            this.carregarTenants();


                        },

                        error: () => {

                            this.alertService.updateToast(
                                loadingToast.id,
                                'Erro ao atualizar tenant.',
                                'error'
                            );
                        }

                    });

            }
        });

    }

    private carregarTenantPorId(
        id: string
    ): void {

        this.tenantService
            .buscarPorId(id)
            .subscribe({

                next: tenant => {

                    this.tenantEditando = tenant;

                    this.preencherFormulario(
                        tenant
                    );

                    this.mostrarFormulario = true;

                    this.mostrarPainel = true;

                    this.modoVisualizacao = true;

                    this.modoEdicao = false;

                    this.cdr.detectChanges();
                },

                error: erro => {

                    console.error(
                        'Erro ao carregar tenant:',
                        erro
                    );

                    this.alertService.error(
                        'Erro ao carregar dados do tenant.'
                    );

                }

            });

    }

    impersonarTenant(
        tenant: Tenant
    ): void {

        if (!tenant.id) {
            return;
        }

        const loading =
            this.alertService.loading(
                'Iniciando impersonação...'
            );

        this.impersonacaoService
            .impersonar(tenant.id)
            .subscribe({

                next: resposta => {

                    localStorage.setItem(
                        STORAGE_KEYS.TOKEN,
                        resposta.token
                    );

                    this.tenantContextService.setTenant(
                        tenant
                    );

                    localStorage.setItem(
                        'impersonando',
                        'true'
                    );

                    this.authStateService.inicializar();

                    window.location.reload();

                    this.cdr.detectChanges();

                },

                error: () => {

                    this.alertService.updateToast(
                        loading.id,
                        'Erro ao iniciar impersonação.',
                        'error'
                    );

                }

            });

    }

}