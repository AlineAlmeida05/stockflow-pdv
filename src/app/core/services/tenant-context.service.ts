import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tenant } from '../models/tenant.model';

@Injectable({
    providedIn: 'root'
})
export class TenantContextService {

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

    }

    get tenantAtual(): Tenant | null {

        return this.tenantSubject.value;

    }

}