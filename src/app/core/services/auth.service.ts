import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioLogado } from '../models/usuario-logado.model';
import { LoginRequest } from '../models/login-request.model';
import { environment } from '../../../environments/environment';
import { RefreshTokenResponse } from '../models/refresh-token-response.model';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly API =
        `${environment.apiUrl}/api/auth`;

    constructor(
        private http: HttpClient,
    ) { }

    login(request: LoginRequest): Observable<UsuarioLogado> {

        return this.http
            .post<UsuarioLogado>(
                `${this.API}/login`,
                request,
                {
                    withCredentials: true
                }
            )
            .pipe(
                tap(usuario => {

                    localStorage.setItem(
                        'token',
                        usuario.token
                    );

                })
            );

    }

    logout(): Observable<void> {

        return this.http.post<void>(
            `${this.API}/logout`,
            {},
            {
                withCredentials: true
            }
        );

    }

    estaAutenticado(): boolean {

        return !!localStorage.getItem(
            'token'
        );

    }

    rotaInicial(): string {

        return '/dashboard';

    }

    alterarSenha(request: {
        senhaAtual: string;
        novaSenha: string;
        confirmarSenha: string;
    }): Observable<void> {

        return this.http.put<void>(
            `${environment.apiUrl}/api/usuarios/alterar-senha`,
            request
        );

    }

    me(): Observable<UsuarioLogado> {

        return this.http.get<UsuarioLogado>(
            `${this.API}/me`,
            {
                withCredentials: true
            }
        );

    }

    refresh(): Observable<RefreshTokenResponse> {

        return this.http.post<RefreshTokenResponse>(
            `${this.API}/refresh`,
            {},
            {
                withCredentials: true
            }
        );

    }
}