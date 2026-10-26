import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from '../models/auditoria.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(
      `${environment.apiUrl}/auditoria`
    );
  }
}