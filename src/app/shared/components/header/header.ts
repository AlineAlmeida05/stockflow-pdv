import { ChangeDetectorRef, Component } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { BrandingService } from '../../../core/services/branding.service';

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
        private alertService: AlertService,
        private cdr: ChangeDetectorRef,
        private brandingService: BrandingService,
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

                    this.cdr.detectChanges();

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

    get logoExibicao(): string {

        return this.brandingService
            .obterLogo();

    }

    get nomeExibicao(): string {

        return this.brandingService
            .obterNomeEmpresa();

    }
}