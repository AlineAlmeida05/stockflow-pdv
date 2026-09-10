import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Cliente } from '../models/cliente.model';
import { ClienteResumo } from '../models/cliente-resumo.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/clientes`;

  listar(): Observable<Cliente[]> {

    return this.http.get<Cliente[]>(
      this.apiUrl
    );

  }

  salvar(
    cliente: Cliente
  ): Observable<Cliente> {

    return this.http.post<Cliente>(
      this.apiUrl,
      cliente
    );

  }

  atualizar(
    cliente: Cliente
  ): Observable<Cliente> {

    return this.http.put<Cliente>(
      `${this.apiUrl}/${cliente.id}`,
      cliente
    );

  }

  excluir(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

  obterResumo(
    clienteId: string
  ): Observable<ClienteResumo> {

    return this.http.get<ClienteResumo>(
      `${this.apiUrl}/${clienteId}/resumo`
    );
  }

}