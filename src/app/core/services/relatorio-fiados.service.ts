import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment }
    from '../../../environments/environment';

import { DashboardFiados }
    from '../models/dashboard-fiados.model';

@Injectable({
    providedIn: 'root'
})
export class RelatorioFiadosService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/relatorios/fiados`;

    buscar(): Observable<DashboardFiados> {

        return this.http.get<DashboardFiados>(
            this.apiUrl
        );

    }

}