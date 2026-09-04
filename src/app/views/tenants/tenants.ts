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
    novoResponsavel = '';
    novoEmail = '';
    novaCidade = '';

    salvando = false;

    tenantEditando: Tenant | null = null;

    modoEdicao = false;

    mostrarFormulario = false;

    textoBusca = '';


    colunasTenants = [
        {
            field: 'nome',
            header: 'Nome'
        },
        {
            field: 'responsavel',
            header: 'Responsável'
        },
        {
            field: 'email',
            header: 'Email'
        },
        {
            field: 'cidade',
            header: 'Cidade'
        },
        {
            field: 'status',
            header: 'Status'
        }
    ];

    constructor(
        private tenantService: TenantService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.carregarTenants();

    }

    salvarTenant(): void {

        if (!this.novoNome.trim()) {

            alert('Informe o nome da adega.');

            return;

        }

        this.salvando = true;

        const loadingToast =
            this.alertService.loading(
                'Criando tenant...'
            );

        this.tenantService
            .salvar({
                nome: this.novoNome,
                responsavel: this.novoResponsavel,
                email: this.novoEmail,
                cidade: this.novaCidade,
                ativo: true,
                marketingIaHabilitado: false,
                deliveryHabilitado: false
            })
            .subscribe({

                next: (tenantCriado) => {

                    this.tenants = [
                        ...this.tenants,
                        tenantCriado
                    ];

                    this.novoNome = '';
                    this.novoResponsavel = '';
                    this.novoEmail = '';
                    this.novaCidade = '';

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

    excluirTenant(id: string): void {

        if (
            !confirm(
                'Deseja realmente excluir este tenant?'
            )
        ) {

            return;

        }

        const loadingToast =
            this.alertService.loading(
                'Excluindo tenant...'
            );

        this.tenantService
            .excluir(id)
            .subscribe({

                next: () => {

                    this.tenants =
                        this.tenants.filter(
                            tenant => tenant.id !== id
                        );

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.success(
                        'Tenant excluído com sucesso.'
                    );

                    this.cdr.detectChanges();

                },

                error: () => {

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.error(
                        'Erro ao excluir tenant.'
                    );

                }

            });
    }

    carregarTenants(): void {

        console.log('Carregando tenants...');

        this.tenantService
            .listar()
            .subscribe({

                next: (tenants) => {

                    console.log(
                        'Tenants recebidos:',
                        tenants
                    );

                    this.tenants = tenants;

                    console.log(
                        'this.tenants:',
                        this.tenants
                    );

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


    editarTenant(
        tenant: Tenant
    ): void {

        this.tenantEditando = tenant;

        this.mostrarFormulario = true;

        this.modoEdicao = true;

        this.novoNome =
            tenant.nome ?? '';

        this.novoResponsavel =
            tenant.responsavel ?? '';

        this.novoEmail =
            tenant.email ?? '';

        this.novaCidade =
            tenant.cidade ?? '';

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

        this.tenantService
            .atualizar(
                this.tenantEditando.id,
                {
                    ...this.tenantEditando,
                    nome: this.novoNome,
                    responsavel: this.novoResponsavel,
                    email: this.novoEmail,
                    cidade: this.novaCidade
                }

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

                    this.cdr.detectChanges();

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
        this.novoResponsavel = '';
        this.novoEmail = '';
        this.novaCidade = '';

    }

    novoTenant(): void {

        this.mostrarFormulario = true;

        this.modoEdicao = false;

        this.tenantEditando = null;

        this.novoNome = '';
        this.novoResponsavel = '';
        this.novoEmail = '';
        this.novaCidade = '';

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
}