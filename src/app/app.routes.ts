import { LoginComponent } from './features/auth/login/login.component';
import { Routes } from '@angular/router';
import { Clientes } from './views/clientes/clientes';
import { Produtos } from './views/produtos/produtos';
import { EntradaDeEstoque } from './views/entrada-de-estoque/entrada-de-estoque';
import { Estoque } from './views/estoque/estoque';
import { NovaVenda } from './views/nova-venda/nova-venda';
import { Fiados } from './views/fiados/fiados';
import { HistoricoDeVendas } from './views/historico-de-vendas/historico-de-vendas';
import { Dashboard } from './views/dashboard/dashboard';
import { Promocoes } from './views/promocoes/promocoes';
import { Relatorios } from './views/relatorios/relatorios';
import { EmpresaComponent } from './views/empresa/empresa';
import { Marketing } from './views/marketing/marketing';
import { Tenants } from './views/tenants/tenants';
import { Usuarios } from './views/usuarios/usuarios';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        redirectTo: 'stockflowpdv/login',
        pathMatch: 'full'
    },
    {
        path: ':slug/login',
        component: LoginComponent,
        canActivate: [guestGuard]
    },
    {
        path: 'produtos',
        component: Produtos,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'ESTOQUISTA'
            ]
        }
    },
    {
        path: 'clientes',
        component: Clientes,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'OPERADOR_CAIXA'
            ]
        }
    },
    {
        path: 'entrada-de-estoque',
        component: EntradaDeEstoque,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'ESTOQUISTA'
            ]
        }
    },
    {
        path: 'estoque',
        component: Estoque,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'ESTOQUISTA'
            ]
        }
    },
    {
        path: 'nova-venda',
        component: NovaVenda,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'OPERADOR_CAIXA'
            ]
        }
    },
    {
        path: 'fiados',
        component: Fiados,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'OPERADOR_CAIXA'
            ]
        }
    },
    {
        path: 'historico-de-vendas',
        component: HistoricoDeVendas,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'OPERADOR_CAIXA'
            ]
        }
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'promocoes',
        component: Promocoes,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE'
            ]
        }
    },
    {
        path: 'relatorios',
        component: Relatorios,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE']
        }
    },
    {
        path: 'marketing',
        component: Marketing,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE'
            ]
        }
    },
    {
        path: 'empresa',
        component: EmpresaComponent,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE'
            ]
        }
    },
    {
        path: 'tenants',
        component: Tenants,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN'
            ]
        }
    },
    {
        path: 'usuarios',
        component: Usuarios,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE'
            ]
        }
    },


];