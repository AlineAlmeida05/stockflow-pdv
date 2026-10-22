import { Component, EventEmitter, Output, HostListener, ElementRef, ViewChild } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { BRANDING_CONFIG } from '../../../config/branding.config';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlterarSenhaModal } from '../alterar-senha-modal/alterar-senha-modal';

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
    profileMenu?: ElementRef;

    menuPerfilAberto = false;

    modalAlterarSenhaAberto = false;

    branding = BRANDING_CONFIG;

    constructor(
        public tenantContextService: TenantContextService,
        private authService: AuthService,
        private router: Router,
    ) {
    }

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

        this.authService.logout();

        this.router.navigate([
            '/login'
        ]);

    }

    alternarMenu(): void {

        this.toggleMenu.emit();

    }

    get primeiroNome(): string {

        return this.usuarioLogado?.nome
            ?.split(' ')[0] ?? '';

    }

    get usuarioLogado() {

        return this.authService
            .usuarioLogado();

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

        if (
            this.profileMenu &&
            !this.profileMenu.nativeElement.contains(event.target)
        ) {

            console.log('fora');

            this.menuPerfilAberto = false;

        }

    }
}