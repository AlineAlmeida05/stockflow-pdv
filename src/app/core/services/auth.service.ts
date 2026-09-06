import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { UsuarioLogado } from '../models/usuario-logado.model';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { LoginRequest } from '../models/login-request.model';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly API =
        `${environment.apiUrl}/api/auth`;

    constructor(
        private http: HttpClient
    ) { }

    login(request: LoginRequest): Observable<UsuarioLogado> {
        return this.http
            .post<UsuarioLogado>(
                `${this.API}/login`,
                request
            )
            .pipe(
                tap(usuario => {
                    localStorage.setItem(
                        STORAGE_KEYS.USUARIO_LOGADO,
                        JSON.stringify(usuario)
                    );
                })
            );
    }

    logout(): void {
        localStorage.removeItem(
            STORAGE_KEYS.USUARIO_LOGADO
        );
    }

    usuarioLogado(): UsuarioLogado | null {

        const dados = localStorage.getItem(
            STORAGE_KEYS.USUARIO_LOGADO
        );

        if (!dados) {
            return null;
        }

        try {
            return JSON.parse(dados) as UsuarioLogado;
        } catch {
            return null;
        }
    }

    estaAutenticado(): boolean {
        return this.usuarioLogado() !== null;
    }

    rotaInicial(): string {

        const usuario = this.usuarioLogado();

        if (!usuario) {
            return '/login';
        }

        switch (usuario.perfil) {

            case 'SUPER_ADMIN':
            case 'PROPRIETARIO':
            case 'SOCIO':
            case 'GERENTE':
                return '/dashboard';

            case 'OPERADOR_CAIXA':
                return '/nova-venda';

            case 'ESTOQUISTA':
                return '/estoque';

            default:
                return '/dashboard';
        }
    }
}