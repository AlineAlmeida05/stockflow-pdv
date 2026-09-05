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


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'produtos',
        pathMatch: 'full'
    },
    {
        path: 'produtos',
        component: Produtos
    },
    {
        path: 'clientes',
        component: Clientes
    },
    {
        path: 'entrada-de-estoque',
        component: EntradaDeEstoque
    },
    {
        path: 'estoque',
        component: Estoque
    },
    {
        path: 'nova-venda',
        component: NovaVenda
    },
    {
        path: 'fiados',
        component: Fiados
    },
    {
        path: 'historico-de-vendas',
        component: HistoricoDeVendas
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'promocoes',
        component: Promocoes
    },
    {
        path: 'relatorios',
        component: Relatorios
    },
    {
        path: 'marketing',
        component: Marketing
    },
    {
        path: 'empresa',
        component: EmpresaComponent
    },
    {
        path: 'tenants',
        component: Tenants
    },
    {
        path: 'usuarios',
        component: Usuarios
    },


];