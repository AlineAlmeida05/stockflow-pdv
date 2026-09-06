import { Observable, tap, finalize } from 'rxjs';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from '../../../core/services/tenant.service';
import { OnInit } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form!: FormGroup;

    loading = false;

    slug = '';

    mostrarSenha = false;

    titulo = 'StockFlow PDV';

    slogan = 'Controle total do seu negócio';

    tenant: any = null;

    tenantNaoEncontrado = false;

    ngOnInit(): void {

        this.route.paramMap
            .subscribe(() => {

                this.carregarTenant();

            });

    }

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private tenantService: TenantService,
        private tenantContextService: TenantContextService
    ) {
        this.form = this.fb.group({

            email: [
                '',
                [
                    Validators.required,

                    Validators.email
                ]
            ],
            senha: [
                '',
                [
                    Validators.required
                ]
            ]

        })
    }

    submit(): void {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;

        const loadingToast =
            this.alertService.loading(
                'Entrando...'
            );

        const request = {

            ...this.form.value,

            slug: this.slug

        };

        this.authService
            .login(request)
            .pipe(
                finalize(() => {

                    this.loading = false;

                    this.cdr.detectChanges();

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                })
            )
            .subscribe({
                next: usuario => {

                    if (this.tenant) {

                        this.tenantContextService
                            .setTenant(
                                this.tenant
                            );

                    }

                    this.alertService.success(
                        'Login realizado com sucesso.'
                    );

                    this.router.navigate([
                        this.authService.rotaInicial()
                    ]);

                },

                error: () => {

                    this.alertService.error(
                        'Usuário ou senha inválidos.'
                    );

                }
            });
    }

    alternarSenha(): void {

        this.mostrarSenha =
            !this.mostrarSenha;

    }

    get sloganExibicao(): string {

        const sloganTenant =
            this.tenant?.slogan?.trim();

        return sloganTenant || this.slogan;

    }

    aplicarTemaTenant(): void {

        if (!this.tenant) {
            return;
        }

        document.documentElement.style.setProperty(
            '--login-primary',
            this.tenant.corPrimaria || 'var(--color-primary)'
        );

        document.documentElement.style.setProperty(
            '--login-secondary',
            this.tenant.corSecundaria || 'var(--color-secondary)'
        );

    }

    voltar(): void {

        this.router.navigate([
            '/stockflowpdv/login'
        ]);

    }

    private carregarTenant(): void {

        this.tenantNaoEncontrado = false;

        this.tenant = null;

        this.slug =
            this.route.snapshot.paramMap.get('slug')
            ?? '';

        this.tenantService
            .buscarPorSlug(this.slug)
            .subscribe({
                next: tenant => {

                    if (!tenant) {

                        this.tenantNaoEncontrado = true;

                        return;
                    }

                    this.tenant = tenant;

                    this.aplicarTemaTenant();

                },

                error: erro => {

                    if (erro.status === 404) {

                        this.tenantNaoEncontrado = true;

                    }
                    if (erro.status === 0) {

                        console.log(
                            'Backend indisponível'
                        );

                    }

                }
            });

    }
}