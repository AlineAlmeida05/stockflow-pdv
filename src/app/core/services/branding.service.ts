import { Injectable } from '@angular/core';
import { COMPANY_CONFIG } from '../../config/company.config';
import { BRANDING_CONFIG } from '../../config/branding.config';

@Injectable({
    providedIn: 'root'
})
export class BrandingService {

    aplicarTema(): void {

        if (typeof document === 'undefined') {
            return;
        }

        const root = document.documentElement;

        root.style.setProperty(
            '--color-primary',
            BRANDING_CONFIG.cores.primaria
        );

        root.style.setProperty(
            '--color-secondary',
            BRANDING_CONFIG.cores.secundaria
        );

        root.style.setProperty(
            '--color-tertiary',
            BRANDING_CONFIG.cores.terciaria
        );
    }

    obterNomeEmpresa(): string {
        return BRANDING_CONFIG.nomeExibicao;
    }

    obterLogo(): string {
        return BRANDING_CONFIG.logo;
    }
}
