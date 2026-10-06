import { Produtos } from './produtos';

describe(
    'Produtos',
    () => {

        let component: Produtos;

        beforeEach(() => {

            component =
                new Produtos(
                    {} as never,
                    {} as never,
                    {} as never,
                    {} as never
                );

        });

        it(
            'deve retornar todos os produtos quando a busca estiver vazia',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky'
                    } as never,
                    {
                        nome: 'Cerveja'
                    } as never
                ];

                component.textoBusca = '';

                expect(
                    component.produtosFiltrados.length
                ).toBe(2);

            }
        );

        it(
            'deve filtrar produtos pelo nome',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky'
                    } as never,
                    {
                        nome: 'Cerveja'
                    } as never,
                    {
                        nome: 'Vodka'
                    } as never
                ];

                component.textoBusca = 'whi';

                expect(
                    component.produtosFiltrados.length
                ).toBe(1);

                expect(
                    component.produtosFiltrados[0].nome
                ).toBe('Whisky');

            }
        );

        it(
            'deve ignorar maiúsculas e minúsculas na busca',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky'
                    } as never
                ];

                component.textoBusca = 'WHISKY';

                expect(
                    component.produtosFiltrados.length
                ).toBe(1);

            }
        );

        it(
            'deve exibir "-" quando o produto não possuir preço promocional',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky',
                        ativo: true,
                        precoPromocional: 0
                    } as never
                ];

                const resultado =
                    component.produtosTabela as any[];

                expect(
                    resultado[0]
                        .precoPromocional
                ).toBe('-');

            }
        );

        it(
            'deve exibir status Ativo para produtos ativos',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky',
                        ativo: true
                    } as never
                ];

                const resultado =
                    component.produtosTabela as any[];

                expect(
                    resultado[0].status
                ).toBe('Ativo');

            }
        );

        it(
            'deve exibir status Inativo para produtos inativos',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky',
                        ativo: false
                    } as never
                ];

                const resultado =
                    component.produtosTabela as any[];

                expect(
                    resultado[0].status
                ).toBe('Inativo');

            }
        );

        it(
  'deve exibir aviso quando o nome estiver vazio',
  () => {

    const alertService = {
      warning: vi.fn()
    };

    component =
      new Produtos(
        {} as never,
        {} as never,
        alertService as never,
        {} as never
      );

    component.nome = '';

    component.salvarProduto();

    expect(
      alertService.warning
    ).toHaveBeenCalledWith(
      'Informe o nome do produto.'
    );

  }
);

    }
);
