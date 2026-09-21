import { Injectable } from '@angular/core';

import { Empresa } from '../models/empresa.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class EmpresaService {

    constructor(
    private http: HttpClient
) {}

    private readonly apiUrl =
    `${environment.apiUrl}/api/empresa`;


    obter(): Observable<Empresa> {

    return this.http.get<Empresa>(
        this.apiUrl,
    );

}

    salvar(
    empresa: Empresa
): Observable<Empresa> {

    return this.http.put<Empresa>(
        this.apiUrl,
        empresa
    );

}

}