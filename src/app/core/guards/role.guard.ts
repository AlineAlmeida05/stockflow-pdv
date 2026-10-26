import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';

export const roleGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot
) => {

    const authService = inject(AuthService);

    const authStateService = inject(AuthStateService);

    const router = inject(Router);

    const usuario = authStateService.usuario;

    if (!usuario) {

        router.navigate([
            '/stockflowpdv/login'
        ]);

        return false;
    }

    const perfisPermitidos =
        route.data?.['perfis'] as string[];

    if (!perfisPermitidos?.length) {
        return true;
    }

    const permitido = perfisPermitidos.includes(
            usuario.perfil
        );

    if (permitido) {
        return true;
    }

    router.navigate([
        authService.rotaInicial()
    ]);

    return false;

};