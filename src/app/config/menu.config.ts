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
      'Operador_Caixa',
      'Estoquista'
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
      'Operador_Caixa'
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
      'Estoquista'
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
      'Estoquista'
    ]
  }, {
    label: 'Entrada de Estoque',
    route: '/entrada-de-estoque',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'SOCIO',
      'GERENTE',
      'Estoquista'
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
      'Operador_Caixa'
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
  }
];

