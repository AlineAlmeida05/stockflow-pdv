import { Injectable } from '@angular/core';
import { COMPANY_CONFIG } from '../../config/company.config';
import { BRANDING_CONFIG } from '../../config/branding.config';
import { TenantContextService } from './tenant-context.service';

@Injectable({
    providedIn: 'root'
})
export class BrandingService {

    constructor(
        private tenantContextService: TenantContextService
    ) { }

    obterNomeEmpresa(): string {

        return this.tenantContextService
            .tenantAtual?.nome
            || BRANDING_CONFIG.nomeExibicao;

    }

    obterLogo(): string {

        return this.tenantContextService
            .tenantAtual?.logoUrl
            || BRANDING_CONFIG.logo;

    }

    
}
