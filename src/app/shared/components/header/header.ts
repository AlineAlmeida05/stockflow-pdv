import { Component } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { BRANDING_CONFIG } from '../../../config/branding.config';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header {

    constructor(
        public tenantContextService: TenantContextService,
        private authService: AuthService,
        private router: Router
    ) { }

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
}