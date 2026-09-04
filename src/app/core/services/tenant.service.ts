import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tenant } from '../models/tenant.model';

@Injectable({
    providedIn: 'root'
})
export class TenantService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
    'https://glorious-cod-5gg6gxqqvxq5fp6g4-8080.app.github.dev/api/tenants';

    listar(): Observable<Tenant[]> {

        console.log('API URL:', this.apiUrl);

        return this.http.get<Tenant[]>(
            this.apiUrl
        );

    }

    salvar(
        tenant: Tenant
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



}