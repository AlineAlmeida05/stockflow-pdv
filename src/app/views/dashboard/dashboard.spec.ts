import { Dashboard } from './dashboard';

describe(
    'Dashboard',
    () => {

        let component: Dashboard;

        beforeEach(() => {

            component =
                new Dashboard(
                    {} as never,
                    {} as never,
                    {} as never,
                    {} as never,
                    {} as never
                );

        });

        it('deve retornar Hoje para o período hoje',
            () => {

                component.periodoSelecionado =
                    'hoje';

                expect(
                    component.descricaoPeriodo
                ).toBe(
                    'Hoje'
                );

            }
        );

        it('deve retornar 7 dias para o período 7dias',
            () => {

                component.periodoSelecionado =
                    '7dias';

                expect(
                    component.descricaoPeriodo
                ).toBe(
                    '7 dias'
                );

            }
        );

        it('deve retornar 30 dias para o período 30dias',
            () => {

                component.periodoSelecionado =
                    '30dias';

                expect(
                    component.descricaoPeriodo
                ).toBe(
                    '30 dias'
                );

            }
        );

        it('deve retornar Mês Atual para o período mes',
            () => {

                component.periodoSelecionado =
                    'mes';

                expect(
                    component.descricaoPeriodo
                ).toBe(
                    'Mês Atual'
                );

            }
        );

        it('deve retornar Todos para o período todos',
            () => {

                component.periodoSelecionado =
                    'todos';

                expect(
                    component.descricaoPeriodo
                ).toBe(
                    'Todos'
                );

            }
        );

        it('deve retornar apenas produtos sem estoque',
            () => {

                component.produtos = [
                    {
                        estoqueAtual: 0
                    } as never,

                    {
                        estoqueAtual: 10
                    } as never,

                    {
                        estoqueAtual: 0
                    } as never
                ];

                expect(
                    component.produtosSemEstoque.length
                ).toBe(2);

            }
        );

        it('deve retornar apenas produtos com estoque acima de zero e abaixo do mínimo',
            () => {

                component.produtos = [
                    {
                        estoqueAtual: 2,
                        estoqueMinimo: 5
                    } as never,

                    {
                        estoqueAtual: 10,
                        estoqueMinimo: 5
                    } as never,

                    {
                        estoqueAtual: 0,
                        estoqueMinimo: 5
                    } as never
                ];

                expect(
                    component.produtosEstoqueBaixo.length
                ).toBe(1);

            }
        );

        it('deve formatar PIX corretamente',
            () => {

                expect(
                    component.formatarPagamento(
                        'pix'
                    )
                ).toBe(
                    'PIX'
                );

            }
        );

        it('deve formatar crédito corretamente',
            () => {

                expect(
                    component.formatarPagamento(
                        'credito'
                    )
                ).toBe(
                    'Crédito'
                );

            }
        );
    }
);