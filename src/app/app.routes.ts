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
import { ExtratoFinanceiro } from './views/extrato-financeiro/extrato-financeiro';
import { AuditoriaComponent } from './views/auditoria/auditoria';

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
                'Socio',
                'Gerente',
                'Estoquista'
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
                'Socio',
                'Gerente',
                'Operador_Caixa'
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
                'Socio',
                'Gerente',
                'Estoquista'
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
                'Socio',
                'Gerente',
                'Estoquista'
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
                'Socio',
                'Gerente',
                'Operador_Caixa'
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
                'Socio',
                'Gerente',
                'Operador_Caixa'
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
                'Socio',
                'Gerente',
                'Operador_Caixa'
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
                'Socio',
                'Gerente'
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
                'Socio',
                'Gerente']
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
                'Socio',
                'Gerente'
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
                'Socio',
                'Gerente'
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
                'Socio',
                'Gerente'
            ]
        }
    },
    {
        path: 'extrato-financeiro',
        component: ExtratoFinanceiro,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO',
                'Socio',
                'Gerente']
        }
    },
    {
        path: 'auditoria',
        component: AuditoriaComponent,
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            perfis: [
                'SUPER_ADMIN',
                'PROPRIETARIO']
        }
    }


];