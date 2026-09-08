import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { MovimentacaoEstoque } from '../models/movimentacao-estoque.model';

import { MovimentacaoEstoqueRequest }
  from '../models/movimentacao-estoque-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoEstoqueService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
  `${environment.apiUrl}/api/movimentacoes-estoque`;

  listar():
    Observable<MovimentacaoEstoque[]> {

    return this.http.get<
      MovimentacaoEstoque[]
    >(this.apiUrl);

  }

  registrarEntrada(
    request: MovimentacaoEstoqueRequest
  ): Observable<MovimentacaoEstoque> {

    return this.http.post<
      MovimentacaoEstoque
    >(
      this.apiUrl,
      request
    );

  }

  registrarSaida(
    request: MovimentacaoEstoqueRequest
  ): Observable<MovimentacaoEstoque> {

    return this.http.post<
      MovimentacaoEstoque
    >(
      this.apiUrl,
      request
    );

  }

  registrarAjuste(
    request: MovimentacaoEstoqueRequest
  ): Observable<MovimentacaoEstoque> {

    return this.http.post<
      MovimentacaoEstoque
    >(
      this.apiUrl,
      request
    );

  }

}


