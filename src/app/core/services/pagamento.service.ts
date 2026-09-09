import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Pagamento } from '../models/pagamento.model';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/pagamentos`;

  listar(): Observable<Pagamento[]> {

    return this.http.get<Pagamento[]>(
      this.apiUrl
    );

  }

  salvar(
    pagamento: Pagamento
  ): Observable<Pagamento> {

    return this.http.post<Pagamento>(
      this.apiUrl,
      pagamento
    );

  }

}