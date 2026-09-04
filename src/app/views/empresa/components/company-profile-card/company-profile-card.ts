import { Component, Input } from '@angular/core';

import { Empresa } from '../../../../core/models/empresa.model';
import { TenantContextService } from '../../../../core/services/tenant-context.service';


@Component({
    selector: 'app-company-profile-card',
    standalone: true,
    imports: [],
    templateUrl: './company-profile-card.html',
    styleUrl: './company-profile-card.scss'
})
export class CompanyProfileCard {
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