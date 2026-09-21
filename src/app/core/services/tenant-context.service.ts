import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tenant } from '../models/tenant.model';
import { TenantService } from './tenant.service';
import { BRANDING_CONFIG } from '../../config/branding.config';

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

        document.title =
            tenant.nome;

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

        document.documentElement.style
            .setProperty(
                '--color-primary',
                BRANDING_CONFIG.cores.primaria
            );

        document.documentElement.style
            .setProperty(
                '--color-secondary',
                BRANDING_CONFIG.cores.secundaria
            );

        let favicon =
            document.querySelector(
                "link[rel='icon']"
            ) as HTMLLinkElement;

        if (favicon) {

            favicon.href =
                BRANDING_CONFIG.favicon;

        }

        document.title =
            BRANDING_CONFIG.nomeExibicao;

    }

    aplicarTema(
        tenant: Tenant
    ): void {

        document.documentElement.style
            .setProperty(
                '--color-primary',
                tenant.corPrimaria
                || BRANDING_CONFIG.cores.primaria
            );

        document.documentElement.style
            .setProperty(
                '--color-secondary',
                tenant.corSecundaria
                || BRANDING_CONFIG.cores.secundaria
            );

    }

    aplicarFavicon(
        tenant: Tenant
    ): void {

        const faviconUrl =
            tenant.faviconUrl
            || BRANDING_CONFIG.favicon;

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
            faviconUrl;

    }


}