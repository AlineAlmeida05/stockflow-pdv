import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private readonly apiUrl =
        `${environment.apiUrl}/api/usuarios`;

    constructor(
        private http: HttpClient
    ) { }

    listar(): Observable<Usuario[]> {

        return this.http.get<Usuario[]>(
            this.apiUrl
        );

    }

    listarPorTenant(
        tenantId: string
    ): Observable<Usuario[]> {

        return this.http.get<Usuario[]>(
            `${this.apiUrl}/tenant/${tenantId}`
        );

    }

    salvar(
        usuario: Usuario
    ): Observable<Usuario> {

        return this.http.post<Usuario>(
            this.apiUrl,
            usuario
        );

    }

    atualizar(
        id: string,
        usuario: Usuario
    ): Observable<Usuario> {

        return this.http.put<Usuario>(
            `${this.apiUrl}/${id}`,
            usuario
        );

    }

    excluir(
        id: string
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );

    }

}