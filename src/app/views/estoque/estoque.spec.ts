import { Estoque } from './estoque';
import { of, throwError } from 'rxjs';

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

    it('deve retornar a quantidade total de produtos',
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

    it('deve retornar a quantidade de produtos em estoque',
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

    it('deve retornar a quantidade de produtos críticos',
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

    it('deve retornar a quantidade de produtos em atenção',
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

    it('deve filtrar produtos críticos',
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

    it('deve filtrar produtos em atenção',
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

    it('deve ignorar maiúsculas na busca',
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

    it('deve exibir status Sem Estoque',
      () => {

        component.produtos = [
          {
            nome: 'Produto A',
            estoqueAtual: 0,
            estoqueMinimo: 5
          } as never
        ];

        const resultado =
          component.produtosEstoque as any[];

        expect(
          resultado[0].statusEstoque
        ).toBe(
          'Sem Estoque'
        );

      }
    );

    it('deve exibir status Crítico',
      () => {

        component.produtos = [
          {
            nome: 'Produto A',
            estoqueAtual: 5,
            estoqueMinimo: 5
          } as never
        ];

        const resultado =
          component.produtosEstoque as any[];

        expect(
          resultado[0].statusEstoque
        ).toBe(
          'Crítico'
        );

      }
    );

    it('deve exibir status Atenção',
      () => {

        component.produtos = [
          {
            nome: 'Produto A',
            estoqueAtual: 8,
            estoqueMinimo: 5
          } as never
        ];

        const resultado =
          component.produtosEstoque as any[];

        expect(
          resultado[0].statusEstoque
        ).toBe(
          'Atenção'
        );

      }
    );

    it('deve exibir status Em Estoque',
      () => {

        component.produtos = [
          {
            nome: 'Produto A',
            estoqueAtual: 20,
            estoqueMinimo: 5
          } as never
        ];

        const resultado =
          component.produtosEstoque as any[];

        expect(
          resultado[0].statusEstoque
        ).toBe(
          'Em Estoque'
        );

      }
    );

    it('deve calcular corretamente o nível de estoque',
      () => {

        component.produtos = [
          {
            nome: 'Produto A',
            estoqueAtual: 10,
            estoqueMinimo: 5
          } as never
        ];

        const resultado =
          component.produtosEstoque as any[];

        expect(
          resultado[0].nivelEstoque
        ).toBe(
          '100%'
        );

      }
    );

    it('deve retornar hífen quando estoque mínimo for zero',
      () => {

        component.produtos = [
          {
            nome: 'Produto A',
            estoqueAtual: 10,
            estoqueMinimo: 0
          } as never
        ];

        const resultado =
          component.produtosEstoque as any[];

        expect(
          resultado[0].nivelEstoque
        ).toBe(
          '-'
        );

      }
    );

    it('deve carregar produtos no ngOnInit',
      () => {

        const spy =
          vi.spyOn(
            component,
            'carregarProdutos'
          )
            .mockImplementation(
              () => { }
            );

        component.ngOnInit();

        expect(
          spy
        ).toHaveBeenCalled();

      }
    );

    it('deve carregar produtos recebidos do servico',
      () => {

        const produtos = [
          {
            nome: 'Produto A'
          }
        ];

        const produtoService = {
          listar: vi.fn(
            () => of(produtos)
          )
        };

        component =
          new Estoque(
            produtoService as never,
            {
              detectChanges: vi.fn()
            } as never
          );

        component.carregarProdutos();

        expect(
          component.produtos
        ).toEqual(produtos);

      }
    );

    it('deve tratar erro ao carregar produtos',
      () => {

        const consoleSpy =
          vi.spyOn(
            console,
            'error'
          )
            .mockImplementation(
              () => { }
            );

        const produtoService = {
          listar: vi.fn(
            () =>
              throwError(
                () => new Error()
              )
          )
        };

        component =
          new Estoque(
            produtoService as never,
            {
              detectChanges: vi.fn()
            } as never
          );

        component.carregarProdutos();

        expect(
          consoleSpy
        ).toHaveBeenCalled();

      }
    );

    it('deve filtrar produtos normais',
      () => {

        component.produtos = [
          {
            nome: 'A',
            estoqueAtual: 20,
            estoqueMinimo: 5
          } as any,
          {
            nome: 'B',
            estoqueAtual: 5,
            estoqueMinimo: 5
          } as any
        ];

        component.filtroStatus =
          'normal';

        expect(
          component.produtosFiltrados.length
        ).toBe(1);

      }
    );

    it('deve retornar todos os produtos sem filtro',
      () => {

        component.produtos = [
          {
            nome: 'A'
          } as any,
          {
            nome: 'B'
          } as any
        ];

        component.filtroStatus = '';

        expect(
          component.produtosFiltrados.length
        ).toBe(2);

      }
    );

    it('deve retornar lista vazia quando a busca nao encontrar produto',
      () => {

        component.produtos = [
          {
            nome: 'Whisky'
          } as any
        ];

        component.textoBusca =
          'Vodka';

        expect(
          component.produtosFiltrados.length
        ).toBe(0);

      }
    );

    it('deve selecionar filtro',
      () => {

        component.selecionarFiltro(
          'baixo'
        );

        expect(
          component.filtroStatus
        ).toBe(
          'baixo'
        );

      }
    );

    it('deve focar campo de busca ao carregar produtos',
      () => {

        vi.useFakeTimers();

        const focar = vi.fn();

        const produtoService = {
          listar: vi.fn(
            () => of([])
          )
        };

        component =
          new Estoque(
            produtoService as never,
            {
              detectChanges: vi.fn()
            } as never
          );

        component.searchInput = {
          focar
        } as any;

        component.carregarProdutos();

        vi.runAllTimers();

        expect(
          focar
        ).toHaveBeenCalled();

        vi.useRealTimers();

      }
    );
  }
);