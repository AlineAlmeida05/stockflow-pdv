import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovimentacaoFinanceira } from '../models/movimentacao-financeira.model';
import { IndicadoresExtrato } from '../models/indicadores-extrato.model';

@Injectable({
    providedIn: 'root'
})
export class ExtratoFinanceiroService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/extrato-financeiro`;

    listar():
        Observable<
            MovimentacaoFinanceira[]
        > {

        return this.http.get<
            MovimentacaoFinanceira[]
        >(this.apiUrl);

    }

    obterIndicadores():
    Observable<IndicadoresExtrato> {

    return this.http.get<
        IndicadoresExtrato
    >(
        `${this.apiUrl}/indicadores`
    );

}

}