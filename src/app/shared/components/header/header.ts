import { Component, EventEmitter, Output, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { BRANDING_CONFIG } from '../../../config/branding.config';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlterarSenhaModal } from '../alterar-senha-modal/alterar-senha-modal';
import { ImpersonacaoService } from '../../../core/services/impersonacao.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        AlterarSenhaModal
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header {

    @Output()
    toggleMenu = new EventEmitter<void>();

    @ViewChild('profileMenu')
    profileMenu?: ElementRef<HTMLElement>;

    menuPerfilAberto = false;

    modalAlterarSenhaAberto = false;

    branding = BRANDING_CONFIG;

    constructor(
        public tenantContextService: TenantContextService,
        private authService: AuthService,
        private router: Router,
        private impersonacaoService: ImpersonacaoService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    get tenantAtual() {

        return this
            .tenantContextService
            .tenantAtual;

    }

    @HostListener('document:keydown.escape')
    onEscape(): void {

        if (
            this.modalAlterarSenhaAberto
        ) {

            this.fecharModalAlterarSenha();

        }

    }

    sair(): void {

        if (this.estaImpersonando) {

            this.alertService.warning(
                'Encerre a impersonação antes de sair do sistema.'
            );

            return;

        }

        this.authService
            .logout()
            .subscribe({
                next: () => {

                    this.authService.limparSessao();

                    const slug =
                        this.tenantAtual?.slug
                        ?? 'stockflowpdv';

                    this.router.navigate([
                        `/${slug}/login`
                    ]);

                    this.cdr.detectChanges();

                },

                error: () => {

                    this.authService.limparSessao();

                    const slug =
                        this.tenantAtual?.slug
                        ?? 'stockflowpdv';

                    this.router.navigate([
                        `/${slug}/login`
                    ]);

                }
            });

    }

    alternarMenu(): void {

        this.toggleMenu.emit();

    }

    get primeiroNome(): string {

        return this.usuarioLogado?.nome
            ?.split(' ')[0] ?? '';

    }

    get usuarioLogado() {

        return this.authService.usuarioLogado();

    }

    alternarMenuPerfil(): void {

        this.menuPerfilAberto = !this.menuPerfilAberto;

    }

    abrirModalAlterarSenha(): void {

        this.modalAlterarSenhaAberto = true;

        this.menuPerfilAberto = false;

    }

    fecharModalAlterarSenha(): void {

        this.modalAlterarSenhaAberto = false;

    }

    get ehSuperAdmin(): boolean {

        return this.usuarioLogado?.perfil === 'SUPER_ADMIN';

    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {

        const target = event.target as Node | null;

        if (
            this.profileMenu &&
            target &&
            !this.profileMenu.nativeElement.contains(
                target
            )
        ) {
            this.menuPerfilAberto = false;
        }

    }

    get estaImpersonando(): boolean {

        return localStorage.getItem(
            'impersonando'
        ) === 'true';

    }

    encerrarImpersonacao(): void {

        this.impersonacaoService
            .encerrarImpersonacao()
            .subscribe({

                next: resposta => {

                    localStorage.setItem(
                        'token',
                        resposta.token
                    );

                    localStorage.removeItem(
                        'impersonando'
                    );

                    localStorage.removeItem(
                        'tenantAtivo'
                    );

                    window.location.reload();

                    this.cdr.detectChanges();

                }

            });

    }


}