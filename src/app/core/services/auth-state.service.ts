import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioLogado } from '../models/usuario-logado.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthStateService {

    private readonly usuarioSubject =
        new BehaviorSubject<UsuarioLogado | null>(
            null
        );

    readonly usuario$ =
        this.usuarioSubject.asObservable();

    get usuario(): UsuarioLogado | null {

        return this.usuarioSubject.value;

    }

    constructor(
        private authService: AuthService
    ) { }

    inicializar(): void {

        const token =
            localStorage.getItem(
                'token'
            );

        if (!token) {

            this.usuarioSubject.next(
                null
            );

            return;
        }

        this.authService
            .me()
            .subscribe({
                next: usuario => {

                    this.usuarioSubject.next(
                        usuario
                    );

                },
                error: () => {

                    this.usuarioSubject.next(
                        null
                    );

                }
            });

    }

    limpar(): void {

        this.usuarioSubject.next(
            null
        );

    }

}