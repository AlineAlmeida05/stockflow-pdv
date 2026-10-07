import { ExtratoFinanceiro } from './extrato-financeiro';

describe(
  'ExtratoFinanceiro',
  () => {

    let component: ExtratoFinanceiro;

    beforeEach(() => {

      component =
        new ExtratoFinanceiro(
          {} as never,
          {} as never
        );

    });

    it('deve iniciar na página 1 ao reiniciar paginação',
      () => {

        component.paginaAtual = 5;

        component.reiniciarPaginacao();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it('deve voltar para página 1 ao alterar itens por página',
      () => {

        component.paginaAtual = 3;

        component.alterarItensPorPagina();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it('não deve permitir página anterior quando estiver na primeira página',
      () => {

        component.paginaAtual = 1;

        component.paginaAnterior();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it('deve voltar uma página quando existir página anterior',
      () => {

        component.paginaAtual = 3;

        component.paginaAnterior();

        expect(
          component.paginaAtual
        ).toBe(2);

      }
    );

    it('deve retornar uma página quando não existirem movimentações',
      () => {

        component.movimentacoes = [];

        component.itensPorPagina = '10';

        expect(
          component.totalPaginas
        ).toBe(1);

      }
    );

    it('deve calcular corretamente a quantidade de páginas',
      () => {

        component.movimentacoes =
          Array.from(
            { length: 25 },
            (_, index) => ({
              clienteNome:
                `Cliente ${index}`
            })
          ) as never;

        component.itensPorPagina =
          '10';

        expect(
          component.totalPaginas
        ).toBe(3);

      }
    );

    it('deve filtrar movimentações pelo nome do cliente',
      () => {

        component.movimentacoes = [
          {
            clienteNome: 'Maria'
          } as never,

          {
            clienteNome: 'Joao'
          } as never
        ];

        component.textoBusca = 'maria';

        expect(
          component.movimentacoesFiltradas.length
        ).toBe(1);

      }
    );

    it('deve ignorar maiúsculas e minúsculas na busca',
      () => {

        component.movimentacoes = [
          {
            clienteNome: 'Maria'
          } as never
        ];

        component.textoBusca = 'MARIA';

        expect(
          component.movimentacoesFiltradas.length
        ).toBe(1);

      }
    );

    it('deve filtrar movimentações PIX',
      () => {

        component.movimentacoes = [
          {
            tipo: 'pagamento',
            formaPagamento: 'pix'
          } as never,

          {
            tipo: 'pagamento',
            formaPagamento: 'dinheiro'
          } as never
        ];

        component.formaPagamentoSelecionada =
          'pix';

        expect(
          component.movimentacoesFiltradas.length
        ).toBe(1);

      }
    );

    it('deve filtrar movimentações fiado',
      () => {

        component.movimentacoes = [
          {
            tipo: 'fiado'
          } as never,

          {
            tipo: 'pagamento',
            formaPagamento: 'pix'
          } as never
        ];

        component.formaPagamentoSelecionada =
          'fiado';

        expect(
          component.movimentacoesFiltradas.length
        ).toBe(1);

      }
    );

    it('deve retornar apenas itens da página atual',
      () => {

        component.movimentacoes =
          Array.from(
            { length: 25 },
            (_, index) => ({
              clienteNome: `Cliente ${index}`
            })
          ) as never;

        component.itensPorPagina = '10';

        component.paginaAtual = 2;

        expect(
          component.movimentacoesPaginadas.length
        ).toBe(10);

      }
    );

    it('deve filtrar movimentações de hoje',
      () => {

        component.movimentacoes = [
          {
            clienteNome: 'Maria',
            data: new Date().toISOString(),
            tipo: 'fiado'
          } as never,

          {
            clienteNome: 'João',
            data: '2020-01-01',
            tipo: 'fiado'
          } as never
        ];

        component.periodoSelecionado = 'hoje';

        expect(
          component.movimentacoesFiltradas.length
        ).toBe(1);

      }
    );

    it('deve filtrar movimentações dos últimos 7 dias',
      () => {

        const recente =
          new Date(
            Date.now() -
            3 * 24 * 60 * 60 * 1000
          );

        const antiga =
          new Date(
            Date.now() -
            10 * 24 * 60 * 60 * 1000
          );

        component.movimentacoes = [
          {
            data: recente.toISOString(),
            tipo: 'fiado'
          } as never,

          {
            data: antiga.toISOString(),
            tipo: 'fiado'
          } as never
        ];

        component.periodoSelecionado =
          '7dias';

        expect(
          component.movimentacoesFiltradas.length
        ).toBe(1);

      }
    );

    it('deve filtrar movimentações dos últimos 30 dias',
      () => {

        const recente =
          new Date(
            Date.now() -
            10 * 24 * 60 * 60 * 1000
          );

        const antiga =
          new Date(
            Date.now() -
            40 * 24 * 60 * 60 * 1000
          );

        component.movimentacoes = [
          {
            data: recente.toISOString(),
            tipo: 'fiado'
          } as never,

          {
            data: antiga.toISOString(),
            tipo: 'fiado'
          } as never
        ];

        component.periodoSelecionado =
          '30dias';

        expect(
          component.movimentacoesFiltradas.length
        ).toBe(1);

      }
    );

    it('deve voltar para a primeira página ao alterar itens por página',
      () => {

        component.paginaAtual = 5;

        component.alterarItensPorPagina();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it('deve avançar para próxima página',
      () => {

        component.movimentacoes =
          Array.from(
            { length: 30 },
            (_, i) => ({
              clienteNome: `Cliente ${i}`
            })
          ) as never;

        component.itensPorPagina = '10';

        component.proximaPagina();

        expect(
          component.paginaAtual
        ).toBe(2);

      }
    );

    it('não deve ultrapassar a última página',
      () => {

        component.movimentacoes =
          Array.from(
            { length: 10 },
            (_, i) => ({
              clienteNome: `Cliente ${i}`
            })
          ) as never;

        component.itensPorPagina = '10';

        component.paginaAtual = 1;

        component.proximaPagina();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it('deve retornar zero no inicio da pagina sem movimentacoes', () => {

      component.movimentacoes = [];

      expect(
        component.inicioPagina
      ).toBe(0);

    });

    it('deve calcular fim da pagina', () => {

      component.movimentacoes =
        Array.from(
          { length: 25 },
          () => ({})
        ) as any;

      component.itensPorPagina = '10';

      expect(
        component.fimPagina
      ).toBe(10);

    });

    it('deve criar cards zerados sem indicadores', () => {

      (component as any)
        .atualizarIndicadores();

      expect(
        component.cards.length
      ).toBe(5);

    });

    it('deve montar cards com indicadores', () => {

      component.indicadores = {

        totalRecebido: 1000,
        saldoAberto: 200,
        recebimentosHoje: 50,
        clientesDevedores: 3

      } as any;

      (component as any)
        .atualizarIndicadores();

      expect(
        component.cards.length
      ).toBe(5);

      expect(
        component.cards[3].value
      ).toBe(3);

    });

    it('deve carregar indicadores', () => {

      const service = {

        obterIndicadores: () => ({
          subscribe: ({ next }: any) =>
            next({
              totalRecebido: 100
            })
        })

      };

      component =
        new ExtratoFinanceiro(
          service as any,
          {
            detectChanges: vi.fn()
          } as any
        );

      component['carregarIndicadores']();

      expect(
        component.indicadores
          ?.totalRecebido
      ).toBe(100);

    });

    it('deve carregar movimentacoes', () => {

      const service = {

        listar: () => ({
          subscribe: ({ next }: any) =>
            next([
              {
                clienteNome: 'Maria'
              }
            ])
        })

      };

      component =
        new ExtratoFinanceiro(
          service as any,
          {
            detectChanges: vi.fn()
          } as any
        );

      component.carregarMovimentacoes();

      expect(
        component.movimentacoes.length
      ).toBe(1);

    });

    it('deve chamar os carregamentos no ngOnInit', () => {

      const service = {

        listar: vi.fn(() => ({
          subscribe: vi.fn()
        })),

        obterIndicadores: vi.fn(() => ({
          subscribe: vi.fn()
        }))

      };

      component =
        new ExtratoFinanceiro(
          service as any,
          {
            detectChanges: vi.fn()
          } as any
        );

      const spyMov =
        vi.spyOn(
          component,
          'carregarMovimentacoes'
        );

      const spyInd =
        vi.spyOn(
          component as any,
          'carregarIndicadores'
        );

      component.ngOnInit();

      expect(spyMov).toHaveBeenCalled();
      expect(spyInd).toHaveBeenCalled();

    });

    it('deve incrementar pagina quando houver proxima pagina', () => {

      component.movimentacoes =
        Array.from(
          { length: 30 },
          () => ({})
        ) as any;

      component.itensPorPagina = '10';
      component.paginaAtual = 1;

      component.proximaPagina();

      expect(
        component.paginaAtual
      ).toBe(2);

    });

    it('deve focar search input apos carregar movimentacoes', () => {

      vi.useFakeTimers();

      const focar =
        vi.fn();

      component.searchInput = {
        focar
      } as any;

      const service = {

        listar: () => ({
          subscribe: ({ next }: any) =>
            next([])
        })

      };

      component =
        new ExtratoFinanceiro(
          service as any,
          {
            detectChanges: vi.fn()
          } as any
        );

      component.searchInput = {
        focar
      } as any;

      component.carregarMovimentacoes();

      vi.runAllTimers();

      expect(
        focar
      ).toHaveBeenCalled();

      vi.useRealTimers();

    });

  }
);