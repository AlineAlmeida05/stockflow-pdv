import { finalize } from 'rxjs';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from '../../../core/services/tenant.service';
import { OnInit } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tenant } from '../../../core/models/tenant.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form!: FormGroup;

    loading = false;

    slug = '';

    mostrarSenha = false;

    readonly titulo = 'StockFlow PDV';

    readonly slogan = 'Controle total do seu negócio';

    tenant: Tenant | null = null;

    tenantNaoEncontrado = false;

    private destroyRef = inject(DestroyRef);

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private tenantService: TenantService,
        private tenantContextService: TenantContextService,
        private cdr: ChangeDetectorRef
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

    ngOnInit(): void {

        this.route.paramMap
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe(() => {

                this.carregarTenant();

            });

    }

    submit(): void {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;

        const loadingToast = this.alertService.loading(
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

                })
            )
            .subscribe({
                next: () => {

                    if (this.tenant) {

                        this.tenantContextService
                            .setTenant(
                                this.tenant
                            );

                    }

                    this.cdr.detectChanges();

                    this.alertService.updateToast(
                        loadingToast.id,
                        'Login realizado com sucesso.',
                        'success'
                    );

                    this.router.navigate([
                        this.authService.rotaInicial()
                    ]);

                },

                error: () => {

                    this.alertService.updateToast(
                        loadingToast.id,
                        'Usuário ou senha inválidos.',
                        'error'
                    );


                }
            });
    }

    alternarSenha(): void {

        this.mostrarSenha = !this.mostrarSenha;

    }

    get sloganExibicao(): string {

        const sloganTenant = this.tenant?.slogan?.trim();

        return sloganTenant || this.slogan;

    }

    aplicarTemaTenant(): void {

        if (!this.tenant) {
            return;
        }

        document.documentElement.style.setProperty(
            '--login-primary',
            this.tenant.corPrimaria
            || 'var(--color-primary)'
        );

        document.documentElement.style.setProperty(
            '--login-secondary',
            this.tenant.corSecundaria
            || 'var(--color-secondary)'
        );

    }

    voltar(): void {

        this.router.navigate([
            `/${this.slug}/login`
        ]);

    }

    private carregarTenant(): void {

        this.tenantNaoEncontrado = false;

        this.tenant = null;

        this.slug = this.route.snapshot.paramMap.get('slug') ?? '';

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

                    this.cdr.detectChanges();

                },

                error: erro => {

                    if (erro.status === 404) {

                        this.tenantNaoEncontrado = true;

                    }
                    if (erro.status === 0) {

                        this.alertService.error(
                            'Não foi possível conectar ao servidor.'
                        );

                    }

                }
            });

    }
}