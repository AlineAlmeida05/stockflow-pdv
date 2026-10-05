import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

    salvando = false;

    tenantEditando: Tenant | null = null;

    modoEdicao = false;

    modoVisualizacao = false;

    mostrarFormulario = false;

    textoBusca = '';

    novoAtivo = true;

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
        private cdr: ChangeDetectorRef,
        private tenantContextService: TenantContextService,
        private confirmDialogService: ConfirmDialogService
    ) { }

    ngOnInit(): void {

        this.carregarTenants();

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

        const request: TenantCreateRequest = {
            nome: this.novoNome,
            slug: this.novoSlug,
            codigoTenant: this.novoCodigoTenant,
            logoUrl: this.novoLogoUrl,
            faviconUrl: this.novoFaviconUrl,
            corPrimaria: this.novaCorPrimaria,
            corSecundaria: this.novaCorSecundaria,
            responsavel: this.novoResponsavel,
            email: this.novoEmail,
            cidade: this.novaCidade,
            ativo: this.novoAtivo
        };

        this.tenantService
            .salvar(request)
            .subscribe({

                next: (tenantCriado) => {

                    this.tenants = [
                        ...this.tenants,
                        tenantCriado
                    ];

                    this.novoNome = '';
                    this.novoSlug = '';
                    this.novoLogoUrl = '';
                    this.novoFaviconUrl = '';
                    this.novaCorPrimaria = '';
                    this.novaCorSecundaria = '';
                    this.novoResponsavel = '';
                    this.novoEmail = '';
                    this.novaCidade = '';
                    this.novoAtivo = true;

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.success(
                        'Tenant criado com sucesso.'
                    );

                    this.salvando = false;

                    this.cdr.detectChanges();

                },

                error: (erro) => {

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.error(
                        'Erro ao criar tenant.'
                    );

                    this.salvando = false;

                    console.error(erro);

                }

            });

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

        const request: TenantUpdateRequest = {
            nome: this.novoNome,
            slug: this.novoSlug,
            codigoTenant: this.novoCodigoTenant,
            logoUrl: this.novoLogoUrl,
            faviconUrl: this.novoFaviconUrl,
            corPrimaria: this.novaCorPrimaria,
            corSecundaria: this.novaCorSecundaria,
            responsavel: this.novoResponsavel,
            email: this.novoEmail,
            cidade: this.novaCidade,
            ativo: this.novoAtivo
        };

        this.tenantService
            .atualizar(
                this.tenantEditando.id,
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

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.success(
                        'Tenant atualizado com sucesso.'
                    );

                    this.salvando = false;
                    this.modoEdicao = false;
                    this.tenantEditando = null;
                    this.novoAtivo = true;
                    this.cdr.detectChanges();
                    this.novoNome = '';
                    this.novoSlug = '';
                    this.novoLogoUrl = '';
                    this.novoFaviconUrl = '';
                    this.novaCorPrimaria = '';
                    this.novaCorSecundaria = '';
                    this.novoResponsavel = '';
                    this.novoEmail = '';
                    this.novaCidade = '';
                    this.novoAtivo = true;

                },



                error: erro => {

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.error(
                        'Erro ao atualizar tenant.'
                    );

                    this.salvando = false;

                    console.error(erro);

                }

            });

    }

    cancelarEdicao(): void {

        this.mostrarFormulario = false;
        this.modoEdicao = false;
        this.tenantEditando = null;
        this.novoNome = '';
        this.novoSlug = '';
        this.novoLogoUrl = '';
        this.novoFaviconUrl = '';
        this.novaCorPrimaria = '';
        this.novaCorSecundaria = '';
        this.novoResponsavel = '';
        this.novoEmail = '';
        this.novaCidade = '';
        this.novoAtivo = true;

    }

    novoTenant(): void {

        this.mostrarFormulario = true;
        this.modoEdicao = false;
        this.tenantEditando = null;
        this.novoNome = '';
        this.novoSlug = '';
        this.novoLogoUrl = '';
        this.novoFaviconUrl = '';
        this.novaCorPrimaria = '';
        this.novaCorSecundaria = '';
        this.novoResponsavel = '';
        this.novoEmail = '';
        this.novaCidade = '';
        this.novoAtivo = true;

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

        this.tenantEditando = tenant;
        this.mostrarFormulario = true;
        this.modoVisualizacao = true;
        this.modoEdicao = false;
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

    }

    habilitarEdicao(): void {

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

                            this.alertService.removeToast(
                                loadingToast.id
                            );

                            this.alertService.success(
                                tenant.ativo
                                    ? 'Tenant desativado com sucesso.'
                                    : 'Tenant ativado com sucesso.'
                            );

                            this.carregarTenants();

                            this.cdr.detectChanges();

                        },

                        error: erro => {

                            this.alertService.removeToast(
                                loadingToast.id
                            );

                            this.alertService.error(
                                'Erro ao atualizar tenant.'
                            );

                            console.error(
                                'Erro ao atualizar tenant',
                                erro
                            );

                        }

                    });

            }
        });

    }

}