import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';
import { environment } from '../../../environments/environment';
import { ProdutoCreateRequest } from '../models/produto-create-request.model';
import { ProdutoUpdateRequest } from '../models/produto-update-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/produtos`;

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
    produto: ProdutoCreateRequest
  ): Observable<Produto> {

    return this.http.post<Produto>(
      this.apiUrl,
      produto
    );

  }

  atualizar(
    id: string,
    produto: ProdutoUpdateRequest
  ): Observable<Produto> {

    return this.http.put<Produto>(
      `${this.apiUrl}/${id}`,
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