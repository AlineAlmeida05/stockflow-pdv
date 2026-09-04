import { Component, Input } from '@angular/core';
import { Empresa } from '../../../../core/models/empresa.model';
import { TenantContextService } from '../../../../core/services/tenant-context.service';

@Component({
    selector: 'app-company-brand-card',
    standalone: true,
    templateUrl: './company-brand-card.html',
    styleUrl: './company-brand-card.scss'
})
export class CompanyBrandCard {

    @Input()
    empresa!: Empresa;

    constructor(
        public tenantContextService:
            TenantContextService
    ) { }

    get tenantAtual() {

        return this
            .tenantContextService
            .tenantAtual;

    }

}