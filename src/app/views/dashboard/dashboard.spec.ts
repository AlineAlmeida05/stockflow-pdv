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
                    {} as never,
                    {} as never
                );

        });

        it(
            'deve retornar Hoje para o período hoje',
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

        it(
            'deve retornar 7 dias para o período 7dias',
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

        it(
            'deve retornar 30 dias para o período 30dias',
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

        it(
            'deve retornar Mês Atual para o período mes',
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

        it(
            'deve retornar Todos para o período todos',
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

        it(
            'deve retornar apenas produtos sem estoque',
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

        it(
            'deve retornar apenas produtos com estoque baixo',
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

        it(
            'deve retornar a quantidade correta de clientes devedores',
            () => {

                component.fiados = [
                    {
                        clienteId: '1'
                    } as never,

                    {
                        clienteId: '1'
                    } as never,

                    {
                        clienteId: '2'
                    } as never
                ];

                expect(
                    component.clientesDevedores
                ).toBe(2);

            }
        );

        it(
            'deve somar corretamente os fiados em aberto',
            () => {

                component.fiados = [
                    {
                        valorTotal: 100
                    } as never,

                    {
                        valorTotal: 50
                    } as never
                ];

                expect(
                    component.fiadosEmAberto
                ).toBe(150);

            }
        );

        it(
            'deve retornar a quantidade correta de produtos com estoque baixo',
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
                        estoqueAtual: 10,
                        estoqueMinimo: 5
                    } as never
                ];

                expect(
                    component.produtosComEstoqueBaixo
                ).toBe(2);

            }
        );

        it(
            'deve formatar PIX corretamente',
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

        it(
            'deve formatar crédito corretamente',
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

        it(
            'deve retornar a quantidade de vendas de hoje',
            () => {

                component.vendas = [
                    {
                        dataVenda: new Date().toISOString()
                    } as never,

                    {
                        dataVenda: new Date().toISOString()
                    } as never
                ];

                expect(
                    component.totalVendasHoje
                ).toBe(2);

            }
        );

        it(
            'deve somar o faturamento de hoje',
            () => {

                component.vendas = [
                    {
                        dataVenda: new Date().toISOString(),
                        valorTotal: 100
                    } as never,

                    {
                        dataVenda: new Date().toISOString(),
                        valorTotal: 200
                    } as never
                ];

                expect(
                    component.faturamentoHoje
                ).toBe(300);

            }
        );

        it(
            'deve retornar zero quando não existir dashboard',
            () => {

                component.dashboard = undefined;

                expect(
                    component.totalPromocoesAtivas
                ).toBe(0);

            }
        );

        it(
            'deve possuir indicadores promocionais quando houver promoções ativas',
            () => {

                component.dashboard = {
                    promocoesAtivas: 1
                } as never;

                expect(
                    component.possuiIndicadoresPromocionais
                ).toBe(true);

            }
        );

        it(
            'não deve possuir indicadores promocionais quando não houver promoções',
            () => {

                component.dashboard = {
                    promocoesAtivas: 0,
                    totalVendasPromocionais: 0
                } as never;

                expect(
                    component.possuiIndicadoresPromocionais
                ).toBe(false);

            }
        );

        it(
            'deve calcular corretamente produtos ativos e inativos',
            () => {

                component.produtos = [
                    {
                        ativo: true
                    } as never,

                    {
                        ativo: true
                    } as never,

                    {
                        ativo: false
                    } as never
                ];

                const cards =
                    component.cardsProdutos;

                expect(cards[1].value).toBe(2);

                expect(cards[2].value).toBe(1);

            }
        );

        

    }
);