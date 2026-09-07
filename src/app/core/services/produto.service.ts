import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Produto } from '../models/produto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/produtos`;

  listar(): Observable<Produto[]> {

    return this.http.get<Produto[]>(
      this.apiUrl
    );

  }

  buscarPorId(
    id: string
  ): Observable<Produto> {

    return this.http.get<Produto>(
      `${this.apiUrl}/${id}`
    );

  }

  salvar(
    produto: Produto
  ): Observable<Produto> {

    return this.http.post<Produto>(
      this.apiUrl,
      produto
    );

  }

  atualizar(
    produto: Produto
  ): Observable<Produto> {

    return this.http.put<Produto>(
      `${this.apiUrl}/${produto.id}`,
      produto
    );

  }

  excluir(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

  reativar(
    id: string
  ): Observable<void> {

    return this.http.put<void>(
      `${this.apiUrl}/${id}/reativar`,
      {}
    );

  }
}