import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tenant } from '../../core/models/tenant.model';
import { TenantService } from '../../core/services/tenant.service';

import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { DataTable } from '../../shared/components/data-table/data-table';

@Component({
    selector: 'app-tenants',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MainLayout,
        PageTitle,
        DataTable
    ],
    templateUrl: './tenants.html'
})
export class Tenants implements OnInit {

    tenants: Tenant[] = [];

    novoNome = '';
    novoResponsavel = '';
    novoEmail = '';
    novaCidade = '';

    salvando = false;

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

                    this.salvando = false;

                    this.cdr.detectChanges();

                },

                error: (erro) => {

                    this.salvando = false;

                    console.error(erro);

                }

            });

    }

    excluirTenant(id: string): void {

        this.tenantService
            .excluir(id)
            .subscribe({

                next: () => {

                    this.tenants =
                        this.tenants.filter(
                            tenant => tenant.id !== id
                        );

                    this.cdr.detectChanges();

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

                    console.error(erro);

                }

            });

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

}