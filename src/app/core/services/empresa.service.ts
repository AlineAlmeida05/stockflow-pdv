import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Empresa } from '../models/empresa.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/empresa`;

    obter(): Observable<Empresa> {

        return this.http.get<Empresa>(
            this.apiUrl
        );

    }

    atualizar(
        empresa: Empresa
    ): Observable<Empresa> {

        return this.http.put<Empresa>(
            this.apiUrl,
            empresa
        );

    }

}