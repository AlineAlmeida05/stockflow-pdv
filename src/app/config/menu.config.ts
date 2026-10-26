import { MenuItem } from '../core/models/menu-item.model';

export const MENU_CONFIG: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente',
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
      'Socio',
      'Gerente',
      'Operador_Caixa'
    ]
  },
  {
    label: 'Histórico de Vendas',
    route: '/historico-de-vendas',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente',
      'Operador_Caixa'
    ]
  },
  {
    label: 'Estoque',
    route: '/estoque',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente',
      'Estoquista'
    ]
  },
  {
    label: 'Produtos',
    route: '/produtos',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente',
      'Estoquista'
    ]
  }, {
    label: 'Entrada de Estoque',
    route: '/entrada-de-estoque',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente',
      'Estoquista'
    ]
  },
  {
    label: 'Clientes',
    route: '/clientes',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente',
      'Operador_Caixa'
    ]
  },
  {
    label: 'Fiados',
    route: '/fiados',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente',
      'Operador_Caixa'
    ]
  },
  {
    label: 'Promoções',
    route: '/promocoes',
    modulo: 'PROMOCOES',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente'
    ]
  },
  {
    label: 'Relatórios',
    route: '/relatorios',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente'
    ]
  },
  {
    label: 'Marketing IA',
    route: '/marketing',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente'
    ]
  },
  {
    label: 'Empresa',
    route: '/empresa',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente'
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
      'Socio',
      'Gerente'
    ]
  },
  {
    label: 'Extrato Financeiro',
    route: '/extrato-financeiro',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO',
      'Socio',
      'Gerente'
    ]
  },
  {
    label: 'Auditoria',
    route: '/auditoria',
    perfis: [
      'SUPER_ADMIN',
      'PROPRIETARIO'
    ]
  }
];

