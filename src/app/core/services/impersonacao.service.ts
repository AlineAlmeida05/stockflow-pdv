import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ImpersonacaoResponse {
    token: string;
    tenantId: string;
    impersonando: boolean;
}

@Injectable({

    providedIn: 'root'

})
export class ImpersonacaoService {

    private readonly API = `${environment.apiUrl}/super-admin`;

    constructor(

        private http: HttpClient

    ) {}

    impersonar(

        tenantId: string

    ): Observable<ImpersonacaoResponse> {

        return this.http.post<ImpersonacaoResponse>(

            `${this.API}/impersonar/${tenantId}`,

            {}
        );

    }    

    encerrarImpersonacao():

        Observable<ImpersonacaoResponse> {

        return this.http.post<ImpersonacaoResponse>(

            `${this.API}/encerrar-impersonacao`,
            
            {}
        );

    }

}