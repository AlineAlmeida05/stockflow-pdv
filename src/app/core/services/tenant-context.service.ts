import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tenant } from '../models/tenant.model';
import { TenantService } from './tenant.service';

@Injectable({
    providedIn: 'root'
})
export class TenantContextService {

    constructor(
        private tenantService: TenantService
    ) {

        const tenantSalvo =
            localStorage.getItem(
                'tenantAtivo'
            );

        if (tenantSalvo) {

            const tenant =
                JSON.parse(
                    tenantSalvo
                );

            this.setTenant(
                tenant
            );

        }

    }

    private tenantSubject =
        new BehaviorSubject<Tenant | null>(
            null
        );

    readonly tenant$ =
        this.tenantSubject.asObservable();

    setTenant(
        tenant: Tenant
    ): void {

        this.tenantSubject.next(
            tenant
        );

        localStorage.setItem(
            'tenantAtivo',
            JSON.stringify(
                tenant
            )
        );

        this.aplicarTema(
            tenant
        );

        this.aplicarFavicon(
            tenant
        );

    }

    carregarTenantPorSlug(
        slug: string
    ): void {

        this.tenantService
            .buscarPorSlug(
                slug
            )
            .subscribe({

                next: tenant => {

                    if (!tenant) {

                        return;

                    }

                    this.setTenant(
                        tenant
                    );

                },

                error: erro => {

                    console.error(
                        'Erro ao buscar tenant:',
                        erro
                    );

                }

            });

    }

    get tenantAtual(): Tenant | null {

        return this.tenantSubject.value;

    }

    clearTenant(): void {

        localStorage.removeItem(
            'tenantAtivo'
        );

        this.tenantSubject.next(
            null
        );

    }

    aplicarTema(
        tenant: Tenant
    ): void {

        if (tenant.corPrimaria) {

            document.documentElement.style
                .setProperty(
                    '--color-primary',
                    tenant.corPrimaria
                );

        }

        if (tenant.corSecundaria) {

            document.documentElement.style
                .setProperty(
                    '--color-secondary',
                    tenant.corSecundaria
                );

        }

    }

    aplicarFavicon(
        tenant: Tenant
    ): void {

        if (!tenant.faviconUrl) {
            return;
        }

        let favicon =
            document.querySelector(
                "link[rel='icon']"
            ) as HTMLLinkElement;

        if (!favicon) {

            favicon =
                document.createElement(
                    'link'
                );

            favicon.rel = 'icon';

            document.head.appendChild(
                favicon
            );

        }

        favicon.href =
            tenant.faviconUrl;

    }


}