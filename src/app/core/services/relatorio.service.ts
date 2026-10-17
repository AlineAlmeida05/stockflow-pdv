import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { DashboardVendas } from '../models/dashboard-vendas.model';

@Injectable({
    providedIn: 'root'
})
export class RelatorioService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/relatorios/vendas`;

    buscar(
        inicio: string,
        fim: string,
        formaPagamento?: string
    ): Observable<DashboardVendas> {

        let params = new HttpParams()
            .set('inicio', inicio)
            .set('fim', fim);

        if (formaPagamento) {
            params = params.set(
                'formaPagamento',
                formaPagamento
            );
        }

        return this.http.get<DashboardVendas>(
            this.apiUrl,
            { params }
        );
    }
}