import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';


@Component({
    selector: 'app-alterar-senha-modal',
    standalone: true,
    imports: [
        ReactiveFormsModule,
    ],
    templateUrl: './alterar-senha-modal.html',
    styleUrl: './alterar-senha-modal.scss'
})

export class AlterarSenhaModal {

    @Output()
    fechar = new EventEmitter<void>();

    formAlterarSenha: FormGroup;

    salvandoSenha = false;

    mostrarSenhaAtual = false;

    mostrarNovaSenha = false;

    mostrarConfirmacaoSenha = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router,
        private tenantContextService: TenantContextService
    ) {

        this.formAlterarSenha =
            this.fb.group({

                senhaAtual: [
                    '',
                    Validators.required
                ],

                novaSenha: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
                        )
                    ]
                ],

                confirmarSenha: [
                    '',
                    Validators.required
                ]

            });

    }

    fecharModal(): void {

        this.fechar.emit();

    }

    salvarSenha(): void {

        const form = this.formAlterarSenha.getRawValue();

        if (this.formAlterarSenha.invalid) {

            this.formAlterarSenha.markAllAsTouched();

            return;

        }

        if (!this.senhasConferem) {

            this.alertService.warning(
                'As senhas não conferem.'
            );

            return;

        }

        this.salvandoSenha = true;

        const loadingToast =
            this.alertService.loading(
                'Alterando senha...'
            );

        this.authService
            .alterarSenha(
                this.formAlterarSenha.value
            )
            .subscribe({

                next: () => {

                    this.alertService.updateToast(
                        loadingToast.id,
                        'Senha alterada com sucesso. Faça login novamente.',
                        'success'
                    );

                    const slug =
                        this.tenantContextService
                            .tenantAtual
                            ?.slug;

                    this.authService.logout();

                    this.fechar.emit();

                    this.router.navigate([
                        `/${slug}/login`
                    ]);

                },

                error: (erro: any) => {

                    const mensagem =
                        erro?.error?.message
                        || 'Não foi possível alterar a senha.';

                    this.alertService.updateToast(
                        loadingToast.id,
                        mensagem,
                        'error'
                    );

                    this.salvandoSenha = false;

                }

            });

    }

    get novaSenha(): string {

        return this
            .formAlterarSenha
            .get('novaSenha')
            ?.value ?? '';

    }

    get possuiMinimoCaracteres(): boolean {

        return this.novaSenha.length >= 8;

    }

    get possuiMaiuscula(): boolean {

        return /[A-Z]/.test(this.novaSenha);

    }

    get possuiMinuscula(): boolean {

        return /[a-z]/.test(this.novaSenha);

    }

    get possuiNumero(): boolean {

        return /\d/.test(this.novaSenha);

    }

    get possuiEspecial(): boolean {

        return /[^A-Za-z\d]/.test(this.novaSenha);

    }

    get senhasConferem(): boolean {

        return (
            this.formAlterarSenha.value.novaSenha ===
            this.formAlterarSenha.value.confirmarSenha
        );

    }
}