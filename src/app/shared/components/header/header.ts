import { Component } from '@angular/core';
import { TenantContextService }
    from '../../../core/services/tenant-context.service';

import { BRANDING_CONFIG }
    from '../../../config/branding.config';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header {

    constructor(
        public tenantContextService:
            TenantContextService
    ) { }

    branding =
        BRANDING_CONFIG;

    get tenantAtual() {

        return this
            .tenantContextService
            .tenantAtual;

    }
}