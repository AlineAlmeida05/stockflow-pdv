import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Promocao } from '../models/promocao.model';
import { environment } from '../../../environments/environment';
import { ProdutoPromocao } from '../models/produto-promocao.model';


@Injectable({
    providedIn: 'root'
})
export class PromocaoService {


    private readonly apiUrl =
        `${environment.apiUrl}/api/promocoes`;

    constructor(
        private http: HttpClient
    ) { }

    listar(): Observable<Promocao[]> {

        return this.http.get<Promocao[]>(
            this.apiUrl
        );
    }

    listarAtivas(): Observable<Promocao[]> {

        return this.http.get<Promocao[]>(
            `${this.apiUrl}/ativas`
        );
    }

    buscarPorProduto(
        produtoId: string
    ): Observable<Promocao[]> {

        return this.http.get<
            Promocao[]
        >(
            `${this.apiUrl}/produto/${produtoId}`
        );
    }

    criar(
        payload: any
    ): Observable<Promocao> {

        return this.http.post<Promocao>(
            this.apiUrl,
            payload
        );
    }

    encerrar(
        promocaoId: string
    ): Observable<Promocao> {

        return this.http.patch<Promocao>(
            `${this.apiUrl}/${promocaoId}/encerrar`,
            {}
        );
    }

    listarPromocoes() {
        return this.http.get<Promocao[]>(
            `${this.apiUrl}/promocoes/ativas`
        );
    }

    listarCandidatos() {

        return this.http.get<
            ProdutoPromocao[]
        >(
            `${this.apiUrl}/candidatos`
        );

    }
}