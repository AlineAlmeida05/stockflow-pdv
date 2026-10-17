import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment }
    from '../../../environments/environment';

import { DashboardEstoque }
    from '../models/dashboard-estoque.model';

@Injectable({
    providedIn: 'root'
})
export class RelatorioEstoqueService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/relatorios/estoque`;

    buscar(): Observable<DashboardEstoque> {

        return this.http.get<DashboardEstoque>(
            this.apiUrl
        );

    }

}