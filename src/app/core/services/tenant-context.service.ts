import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tenant } from '../models/tenant.model';

@Injectable({
    providedIn: 'root'
})
export class TenantContextService {

    constructor() {

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

        this.aplicarTema(
            tenant
        );

        this.aplicarFavicon(
            tenant
        );

    }

    get tenantAtual(): Tenant | null {

        return this.tenantSubject.value;

    }

    clearTenant(): void {

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