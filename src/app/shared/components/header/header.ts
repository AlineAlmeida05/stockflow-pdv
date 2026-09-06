import { Component } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { BRANDING_CONFIG } from '../../../config/branding.config';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header {

    menuPerfilAberto = false;

    modalAlterarSenhaAberto = false;

    formAlterarSenha!: FormGroup;

    salvandoSenha = false;

    constructor(
        public tenantContextService: TenantContextService,
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private alertService: AlertService
    ) {
        this.formAlterarSenha =
            this.fb.group({

                senhaAtual: [
                    '',
                    Validators.required
                ],

                novaSenha: [
                    '',
                    Validators.required
                ],

                confirmarSenha: [
                    '',
                    Validators.required
                ]

            });

    }

    branding =
        BRANDING_CONFIG;

    get tenantAtual() {

        return this
            .tenantContextService
            .tenantAtual;

    }

    sair(): void {

        this.authService.logout();

        this.router.navigate([
            '/login'
        ]);

    }

    get usuarioLogado() {

        return this.authService
            .usuarioLogado();

    }

    alternarMenuPerfil(): void {

        this.menuPerfilAberto =
            !this.menuPerfilAberto;

    }

    abrirModalAlterarSenha(): void {

        this.modalAlterarSenhaAberto = true;

        this.menuPerfilAberto = false;

    }

    fecharModalAlterarSenha(): void {

        this.modalAlterarSenhaAberto = false;

        this.formAlterarSenha.reset();

    }

    salvarSenha(): void {

        if (this.formAlterarSenha.invalid) {

            this.formAlterarSenha.markAllAsTouched();

            return;

        }

        this.salvandoSenha = true;

        this.authService
            .alterarSenha(
                this.formAlterarSenha.value
            )
            .subscribe({

                next: () => {

                    this.alertService.success(
                        'Senha alterada com sucesso. Faça login novamente.'
                    );

                    const slug =
                        this.tenantAtual?.slug;

                    this.authService.logout();

                    this.router.navigate([
                        `/${slug}/login`
                    ]);

                },

                error: (erro) => {

                    const mensagem =
                        erro?.error?.message
                        || 'Não foi possível alterar a senha.';

                    this.alertService.error(
                        mensagem
                    );

                    this.salvandoSenha = false;

                }

            });

    }
}