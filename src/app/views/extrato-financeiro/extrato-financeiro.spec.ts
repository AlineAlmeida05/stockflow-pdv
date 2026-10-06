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

    it(
      'deve iniciar na página 1 ao reiniciar paginação',
      () => {

        component.paginaAtual = 5;

        component.reiniciarPaginacao();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it(
      'deve voltar para página 1 ao alterar itens por página',
      () => {

        component.paginaAtual = 3;

        component.alterarItensPorPagina();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it(
      'não deve permitir página anterior quando estiver na primeira página',
      () => {

        component.paginaAtual = 1;

        component.paginaAnterior();

        expect(
          component.paginaAtual
        ).toBe(1);

      }
    );

    it(
      'deve voltar uma página quando existir página anterior',
      () => {

        component.paginaAtual = 3;

        component.paginaAnterior();

        expect(
          component.paginaAtual
        ).toBe(2);

      }
    );

    it(
      'deve retornar uma página quando não existirem movimentações',
      () => {

        component.movimentacoes = [];

        component.itensPorPagina = '10';

        expect(
          component.totalPaginas
        ).toBe(1);

      }
    );

    it(
      'deve calcular corretamente a quantidade de páginas',
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

    it(
      'deve filtrar movimentações pelo nome do cliente',
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

    it(
      'deve ignorar maiúsculas e minúsculas na busca',
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

    it(
      'deve filtrar movimentações PIX',
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

    it(
      'deve filtrar movimentações fiado',
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

    it(
      'deve retornar apenas itens da página atual',
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


  }
);