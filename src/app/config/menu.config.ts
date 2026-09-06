import { MenuItem } from '../core/models/menu-item.model';

export const MENU_CONFIG: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'OPERADOR_CAIXA',
      'ESTOQUISTA'
    ]
  },
  {
    label: 'Nova Venda',
    route: '/nova-venda',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'OPERADOR_CAIXA'
    ]
  },
  {
    label: 'Histórico de Vendas',
    route: '/historico-de-vendas',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'OPERADOR_CAIXA'
    ]
  },
  {
    label: 'Estoque',
    route: '/estoque',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'ESTOQUISTA'
    ]
  },
  {
    label: 'Produtos',
    route: '/produtos',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'ESTOQUISTA'
    ]
  }, {
    label: 'Entrada de Estoque',
    route: '/entrada-de-estoque',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'ESTOQUISTA'
    ]
  },
  {
    label: 'Clientes',
    route: '/clientes',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'OPERADOR_CAIXA'
    ]
  },
  {
    label: 'Fiados',
    route: '/fiados',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'OPERADOR_CAIXA'
    ]
  },
  {
    label: 'Promoções',
    route: '/promocoes',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE'
    ]
  },
  {
    label: 'Relatórios',
    route: '/relatorios',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE'
    ]
  },
  {
    label: 'Marketing IA',
    route: '/marketing',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE'
    ]
  },
  {
    label: 'Empresa',
    route: '/empresa',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE'
    ]
  },
  {
    label: 'Tenants',
    route: '/tenants',
    perfis: [
      'SUPER_ADMIN'
    ]
  },
  {
    label: 'Usuários',
    route: '/usuarios',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE'
    ]
  },
];