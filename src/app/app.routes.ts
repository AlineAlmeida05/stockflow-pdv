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


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'produtos',
        component: Produtos,
        canActivate: [authGuard]
    },
    {
        path: 'clientes',
        component: Clientes,
        canActivate: [authGuard]
    },
    {
        path: 'entrada-de-estoque',
        component: EntradaDeEstoque,
        canActivate: [authGuard]
    },
    {
        path: 'estoque',
        component: Estoque,
        canActivate: [authGuard]
    },
    {
        path: 'nova-venda',
        component: NovaVenda,
        canActivate: [authGuard]
    },
    {
        path: 'fiados',
        component: Fiados,
        canActivate: [authGuard]
    },
    {
        path: 'historico-de-vendas',
        component: HistoricoDeVendas,
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'promocoes',
        component: Promocoes,
        canActivate: [authGuard]
    },
    {
        path: 'relatorios',
        component: Relatorios,
        canActivate: [authGuard]
    },
    {
        path: 'marketing',
        component: Marketing,
        canActivate: [authGuard]
    },
    {
        path: 'empresa',
        component: EmpresaComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tenants',
        component: Tenants,
        canActivate: [authGuard]
    },
    {
        path: 'usuarios',
        component: Usuarios,
        canActivate: [authGuard]
    },


];