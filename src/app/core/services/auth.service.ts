import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioLogado } from '../models/usuario-logado.model';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { LoginRequest } from '../models/login-request.model';
import { environment } from '../../../environments/environment';
import { RefreshTokenResponse } from '../models/refresh-token-response.model';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly API = `${environment.apiUrl}/api/auth`;

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
                    localStorage.setItem(
                        STORAGE_KEYS.TOKEN,
                        usuario.token
                    );

                })
            );
    }

    logout(): Observable<void> {

        return this.http.post<void>(
            `${this.API}/logout`,
            {}
        );

    }

    refreshToken(): Observable<RefreshTokenResponse> {

        return this.http.post<RefreshTokenResponse>(
            `${this.API}/refresh`,
            {}
        );

    }

    forgotPassword(
        email: string,
        slug: string
    ): Observable<void> {

        return this.http.post<void>(
            `${this.API}/forgot-password`,
            {
                email,
                slug
            }
        );

    }

    resetPassword(
        token: string,
        novaSenha: string
    ): Observable<void> {

        return this.http.post<void>(
            `${this.API}/reset-password`,
            {
                token,
                novaSenha
            }
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
            return '/stockflowpdv/login';
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

    limparSessao(): void {

        localStorage.removeItem(
            STORAGE_KEYS.USUARIO_LOGADO
        );

        localStorage.removeItem(
            STORAGE_KEYS.TOKEN
        );

    }

    validarToken(
        token: string
    ): Observable<{ valido: boolean }> {

        return this.http.get<{
            valido: boolean
        }>(
            `${this.API}/reset-password/validar`,
            {
                params: {
                    token
                }
            }
        );

    }

}