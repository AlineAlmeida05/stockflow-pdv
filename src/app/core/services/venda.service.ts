import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Venda } from '../models/venda.model';

@Injectable({
    providedIn: 'root'
})
export class VendaService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/vendas`;

    listar(): Observable<Venda[]> {

        return this.http.get<Venda[]>(
            this.apiUrl
        );
    }

    salvar(
        venda: unknown
    ): Observable<Venda> {

        return this.http.post<Venda>(
            this.apiUrl,
            venda
        );
    }

    cancelar(
        vendaId: string,
        motivo: string
    ): Observable<void> {

        return this.http.post<void>(
            `${this.apiUrl}/${vendaId}/cancelar`,
            {
                motivo
            }
        );
    }

}