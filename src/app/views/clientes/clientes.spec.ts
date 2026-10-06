import { Clientes } from './clientes';

describe(
  'Clientes',
  () => {

    let component: Clientes;

    beforeEach(() => {

      component =
        new Clientes(
          {} as never,
          {} as never,
          {} as never,
          {} as never
        );

    });

    it(
  'deve retornar todos os clientes quando a busca estiver vazia',
  () => {

    component.clientes = [
      {
        nome: 'João',
        telefone: '111'
      } as never,

      {
        nome: 'Maria',
        telefone: '222'
      } as never
    ];

    component.textoBusca = '';

    expect(
      component.clientesFiltrados.length
    ).toBe(2);

  }
);

it(
  'deve filtrar clientes pelo nome',
  () => {

    component.clientes = [
      {
        nome: 'João',
        telefone: '111'
      } as never,

      {
        nome: 'Maria',
        telefone: '222'
      } as never
    ];

    component.textoBusca = 'joão';

    expect(
      component.clientesFiltrados.length
    ).toBe(1);

  }
);

it(
  'deve filtrar clientes pelo telefone',
  () => {

    component.clientes = [
      {
        nome: 'João',
        telefone: '11999999999'
      } as never,

      {
        nome: 'Maria',
        telefone: '11888888888'
      } as never
    ];

    component.textoBusca = '9999';

    expect(
      component.clientesFiltrados.length
    ).toBe(1);

  }
);

it(
  'deve ignorar maiúsculas e minúsculas na busca',
  () => {

    component.clientes = [
      {
        nome: 'João Silva',
        telefone: '111'
      } as never
    ];

    component.textoBusca = 'JOÃO';

    expect(
      component.clientesFiltrados.length
    ).toBe(1);

  }
);

it(
  'deve exibir controle Ativo para clientes ativos',
  () => {

    component.clientes = [
      {
        nome: 'João',
        telefone: '111',
        ativo: true
      } as never
    ];

    const resultado =
      component.clientesTabela as any[];

    expect(
      resultado[0].controle
    ).toBe(
      'Ativo'
    );

  }
);

it(
  'deve exibir controle Inativo para clientes inativos',
  () => {

    component.clientes = [
      {
        nome: 'João',
        telefone: '111',
        ativo: false
      } as never
    ];

    const resultado =
      component.clientesTabela as any[];

    expect(
      resultado[0].controle
    ).toBe(
      'Inativo'
    );

  }
);

it(
  'deve exibir sinal negativo para saldo devedor',
  () => {

    expect(
      component.formatarSaldoDevedor(100)
    ).toContain('-');

  }
);

it(
  'deve retornar string vazia para valor undefined',
  () => {

    expect(
      component.formatarSaldoDevedor(undefined)
    ).toBe('');

  }
);

it(
  'deve formatar valor monetário em reais',
  () => {

    expect(
      component.formatarMoeda(100)
    ).toContain('100');

  }
);

it(
  'deve montar tabela com controle Ativo',
  () => {

    component.clientes = [
      {
        nome: 'João',
        telefone: '111',
        ativo: true
      } as never
    ];

    const resultado =
      component.clientesTabela as any[];

    expect(
      resultado[0].controle
    ).toBe('Ativo');

  }
);

it(
  'deve montar tabela com controle Inativo',
  () => {

    component.clientes = [
      {
        nome: 'João',
        telefone: '111',
        ativo: false
      } as never
    ];

    const resultado =
      component.clientesTabela as any[];

    expect(
      resultado[0].controle
    ).toBe('Inativo');

  }
);

  }
);