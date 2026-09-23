import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tenant } from '../models/tenant.model';
import { environment } from '../../../environments/environment';
import { TenantCreateRequest } from '../requests/tenant-create-request';
import { TenantUpdateRequest } from '../requests/tenant-update-request';

@Injectable({
    providedIn: 'root'
})
export class TenantService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/tenants`;

    listar(): Observable<Tenant[]> {

        return this.http.get<Tenant[]>(
            this.apiUrl
        );

    }

    salvar(
        tenant: TenantCreateRequest
    ): Observable<Tenant> {

        return this.http.post<Tenant>(
            this.apiUrl,
            tenant
        );

    }

    excluir(
        id: string
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );

    }

    atualizar(
        id: string,
        tenant: TenantUpdateRequest
    ): Observable<Tenant> {

        return this.http.put<Tenant>(
            `${this.apiUrl}/${id}`,
            tenant
        );

    }

    buscarPorSlug(
        slug: string
    ): Observable<Tenant> {

        return this.http.get<Tenant>(
            `${this.apiUrl}/slug/${slug}`
        );

    }

}