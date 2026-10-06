import { Estoque } from './estoque';

describe(
  'Estoque',
  () => {

    let component: Estoque;

    beforeEach(() => {

      component =
        new Estoque(
          {} as never,
          {} as never
        );

    });

    it(
  'deve retornar a quantidade total de produtos',
  () => {

    component.produtos = [
      {} as never,
      {} as never,
      {} as never
    ];

    expect(
      component.totalProdutos
    ).toBe(3);

  }
);

it(
  'deve retornar a quantidade de produtos em estoque',
  () => {

    component.produtos = [
      {
        estoqueAtual: 15,
        estoqueMinimo: 5
      } as never,

      {
        estoqueAtual: 5,
        estoqueMinimo: 5
      } as never,

      {
        estoqueAtual: 8,
        estoqueMinimo: 5
      } as never
    ];

    expect(
      component.totalEmEstoque
    ).toBe(1);

  }
);

it(
  'deve retornar a quantidade de produtos críticos',
  () => {

    component.produtos = [
      {
        estoqueAtual: 5,
        estoqueMinimo: 5
      } as never,

      {
        estoqueAtual: 2,
        estoqueMinimo: 5
      } as never,

      {
        estoqueAtual: 12,
        estoqueMinimo: 5
      } as never
    ];

    expect(
      component.totalBaixo
    ).toBe(2);

  }
);

it(
  'deve retornar a quantidade de produtos em atenção',
  () => {

    component.produtos = [
      {
        estoqueAtual: 6,
        estoqueMinimo: 5
      } as never,

      {
        estoqueAtual: 10,
        estoqueMinimo: 5
      } as never,

      {
        estoqueAtual: 15,
        estoqueMinimo: 5
      } as never
    ];

    expect(
      component.totalAtencao
    ).toBe(2);

  }
);

it(
  'deve filtrar produtos críticos',
  () => {

    component.produtos = [
      {
        nome: 'A',
        estoqueAtual: 5,
        estoqueMinimo: 5
      } as never,

      {
        nome: 'B',
        estoqueAtual: 20,
        estoqueMinimo: 5
      } as never
    ];

    component.filtroStatus = 'baixo';

    expect(
      component.produtosFiltrados.length
    ).toBe(1);

  }
);

it(
  'deve filtrar produtos em atenção',
  () => {

    component.produtos = [
      {
        nome: 'A',
        estoqueAtual: 7,
        estoqueMinimo: 5
      } as never,

      {
        nome: 'B',
        estoqueAtual: 20,
        estoqueMinimo: 5
      } as never
    ];

    component.filtroStatus = 'atencao';

    expect(
      component.produtosFiltrados.length
    ).toBe(1);

  }
);

it(
  'deve ignorar maiúsculas na busca',
  () => {

    component.produtos = [
      {
        nome: 'Whisky'
      } as never
    ];

    component.textoBusca =
      'WHISKY';

    expect(
      component.produtosFiltrados.length
    ).toBe(1);

  }
);

  }
);