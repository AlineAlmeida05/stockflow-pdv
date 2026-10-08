import { Dashboard } from './dashboard';
import { of, throwError } from 'rxjs';

function criarDashboard(
    vendaService: any = {},
    fiadoService: any = {},
    produtoService: any = {},
    movimentacaoService: any = {},
    dashboardService: any = {}
) {

    return new Dashboard(
        vendaService,
        fiadoService,
        produtoService,
        movimentacaoService,
        dashboardService,
        {
            detectChanges: vi.fn()
        } as any
    );

}

function criarServiceSucesso() {

    return {
        listar: vi.fn().mockReturnValue(of([]))
    };

}

function criarDashboardService() {

    return {
        obterDashboard: vi.fn().mockReturnValue(
            of({})
        )
    };

}

describe('Dashboard', () => {

    let component: Dashboard;

    beforeEach(() => {

        component = criarDashboard();

    });


    describe('ngOnInit', () => {

        it('deve carregar os dados no ngOnInit', () => {

            const vendaService = {
                listar: vi.fn().mockReturnValue(of([]))
            };

            const fiadoService = {
                listar: vi.fn().mockReturnValue(of([]))
            };

            const produtoService = {
                listar: vi.fn().mockReturnValue(of([]))
            };

            const movimentacaoService = {
                listar: vi.fn().mockReturnValue(of([]))
            };

            const dashboardService = {
                obterDashboard: vi.fn().mockReturnValue(of({}))
            };

            const cdr = {
                detectChanges: vi.fn()
            };

            const component = criarDashboard(
                vendaService,
                fiadoService,
                produtoService,
                movimentacaoService,
                dashboardService
            );

            component.ngOnInit();

            expect(vendaService.listar)
                .toHaveBeenCalled();

            expect(fiadoService.listar)
                .toHaveBeenCalled();

            expect(produtoService.listar)
                .toHaveBeenCalled();

            expect(movimentacaoService.listar)
                .toHaveBeenCalled();

            expect(dashboardService.obterDashboard)
                .toHaveBeenCalledWith('hoje');
        });

        it('deve tratar erro ao listar vendas', () => {

            const erroSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => { });

            const vendaService = {
                listar: vi.fn().mockReturnValue(
                    throwError(() => new Error('erro'))
                )
            };

            const component = criarDashboard(
                vendaService,
                criarServiceSucesso(),
                criarServiceSucesso(),
                criarServiceSucesso(),
                {
                    obterDashboard: vi.fn().mockReturnValue(of({}))
                }
            );

            component.ngOnInit();

            expect(
                erroSpy
            ).toHaveBeenCalled();
        });

        it('deve tratar erro ao listar fiados', () => {

            const erroSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => { });

            const component = criarDashboard(
                criarServiceSucesso(),
                {
                    listar: vi.fn().mockReturnValue(
                        throwError(() => new Error('erro'))
                    )
                },
                criarServiceSucesso(),
                criarServiceSucesso(),
                {
                    obterDashboard: vi.fn().mockReturnValue(of({}))
                }
            );

            component.ngOnInit();

            expect(erroSpy).toHaveBeenCalled();
        });

        it('deve tratar erro ao listar produtos', () => {

            const erroSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => { });

            const component = criarDashboard(
                criarServiceSucesso(), // vendas
                criarServiceSucesso(), // fiados
                {
                    listar: vi.fn().mockReturnValue(
                        throwError(() => new Error('erro'))
                    )
                },                    // produtos
                criarServiceSucesso(), // movimentações
                criarDashboardService()
            );

            component.ngOnInit();

            expect(erroSpy).toHaveBeenCalled();
        });

        it('deve tratar erro ao listar movimentacoes', () => {

            const erroSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => { });

            const component = criarDashboard(
                criarServiceSucesso(),
                criarServiceSucesso(),
                criarServiceSucesso(),
                {
                    listar: vi.fn().mockReturnValue(
                        throwError(() => new Error('erro'))
                    )
                },
                criarDashboardService()
            );

            component.ngOnInit();

            expect(erroSpy).toHaveBeenCalled();
        });
    });

    describe('formatarPagamento', () => {

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

        it('deve formatar débito corretamente',
            () => {

                expect(
                    component.formatarPagamento(
                        'debito'
                    )
                ).toBe(
                    'Débito'
                );

            }
        );

        it('deve formatar dinheiro corretamente',
            () => {

                expect(
                    component.formatarPagamento(
                        'dinheiro'
                    )
                ).toBe(
                    'Dinheiro'
                );

            }
        );

        it('deve formatar fiado corretamente',
            () => {

                expect(
                    component.formatarPagamento(
                        'fiado'
                    )
                ).toBe(
                    'Fiado'
                );

            }
        );

        it('deve retornar valor original para pagamento desconhecido',
            () => {

                expect(
                    component.formatarPagamento(
                        'boleto'
                    )
                ).toBe(
                    'boleto'
                );

            }
        );

        it('deve retornar undefined para pagamento indefinido', () => {

            expect(
                component.formatarPagamento(
                    undefined as any
                )
            ).toBeUndefined();

        });

    });

    describe('filtros de periodo', () => {

        it('deve filtrar vendas de hoje',
            () => {

                component.periodoSelecionado =
                    'hoje';

                component.vendas = [
                    {
                        dataVenda:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it('deve filtrar vendas dos ultimos 7 dias',
            () => {

                component.periodoSelecionado =
                    '7dias';

                component.vendas = [
                    {
                        dataVenda:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it('deve filtrar vendas dos ultimos 30 dias',
            () => {

                component.periodoSelecionado =
                    '30dias';

                component.vendas = [
                    {
                        dataVenda:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it('deve filtrar vendas do mes atual',
            () => {

                component.periodoSelecionado =
                    'mes';

                component.vendas = [
                    {
                        dataVenda:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it('deve retornar todas as vendas',
            () => {

                component.periodoSelecionado =
                    'todos';

                component.vendas = [
                    {} as any,
                    {} as any
                ];

                expect(
                    component.vendasFiltradas.length
                ).toBe(2);

            }
        );

        it('deve filtrar fiados de hoje',
            () => {

                component.periodoSelecionado =
                    'hoje';

                component.fiados = [
                    {
                        dataLancamento:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.fiadosFiltrados.length
                ).toBe(1);

            }
        );

        it('deve filtrar fiados dos ultimos 7 dias',
            () => {

                component.periodoSelecionado =
                    '7dias';

                component.fiados = [
                    {
                        dataLancamento:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.fiadosFiltrados.length
                ).toBe(1);

            }
        );

        it('deve filtrar fiados dos ultimos 30 dias',
            () => {

                component.periodoSelecionado =
                    '30dias';

                component.fiados = [
                    {
                        dataLancamento:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.fiadosFiltrados.length
                ).toBe(1);

            }
        );

        it('deve filtrar fiados do mes atual',
            () => {

                component.periodoSelecionado =
                    'mes';

                component.fiados = [
                    {
                        dataLancamento:
                            new Date().toISOString()
                    } as any
                ];

                expect(
                    component.fiadosFiltrados.length
                ).toBe(1);

            }
        );

        it('deve retornar todos os fiados',
            () => {

                component.periodoSelecionado =
                    'todos';

                component.fiados = [
                    {} as any,
                    {} as any
                ];

                expect(
                    component.fiadosFiltrados.length
                ).toBe(2);

            }
        );

        it('deve alterar periodo selecionado',
            () => {

                component = criarDashboard();

                vi.spyOn(
                    component as any,
                    'carregarDashboard'
                ).mockImplementation(
                    () => { }
                );

                component.alterarPeriodo(
                    '7dias'
                );

                expect(
                    component.periodoSelecionado
                ).toBe(
                    '7dias'
                );

            }
        );

        it('deve recarregar dashboard ao alterar periodo',
            () => {

                component = criarDashboard();

                const spy =
                    vi.spyOn(
                        component as any,
                        'carregarDashboard'
                    ).mockImplementation(
                        () => { }
                    );

                component.alterarPeriodo(
                    '30dias'
                );

                expect(
                    spy
                ).toHaveBeenCalled();

            }
        );

    });

    describe('graficos', () => {

        it('deve montar grafico de vendas vazio sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.vendasChartData.labels
            ).toEqual([]);

        });

        it('deve montar grafico de pagamentos vazio sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.pagamentoChartData.labels
            ).toEqual([]);

        });

        it('deve montar grafico de fiados vazio sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.fiadosChartData.labels
            ).toEqual([]);

        });

        it('deve montar grafico de giro vazio sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.giroChartData.labels
            ).toEqual([]);

        });

        it('deve montar grafico top produtos vazio sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.topProdutosChartData.labels
            ).toEqual([]);

        });

        it('deve montar grafico de vendas',
            () => {

                component.dashboard = {
                    evolucaoVendas: [
                        {
                            data: '01/10',
                            total: 100
                        }
                    ]
                } as any;

                expect(
                    component.vendasChartData.labels
                ).toEqual(
                    ['01/10']
                );

            }
        );

        it('deve montar grafico de pagamentos',
            () => {

                component.dashboard = {
                    faturamentoPorPagamento: [
                        {
                            formaPagamento: 'PIX',
                            valor: 100
                        }
                    ]
                } as any;

                expect(
                    component.pagamentoChartData.labels
                ).toEqual(
                    ['PIX']
                );

            }
        );

        it('deve montar grafico top produtos',
            () => {

                component.dashboard = {
                    topProdutosVendidos: [
                        {
                            nome: 'Produto A',
                            quantidade: 10
                        }
                    ]
                } as any;

                expect(
                    component.topProdutosChartData.labels
                ).toEqual(
                    ['Produto A']
                );

            }
        );

        it('deve montar grafico de fiados',
            () => {

                component.dashboard = {
                    evolucaoFiados: [
                        {
                            data: '01/10',
                            total: 50
                        }
                    ]
                } as any;

                expect(
                    component.fiadosChartData.labels
                ).toEqual(
                    ['01/10']
                );

            }
        );

        it('deve montar grafico de giro',
            () => {

                component.dashboard = {
                    giroEstoque: [
                        {
                            nome: 'Produto A',
                            giro: 80
                        }
                    ]
                } as any;

                expect(
                    component.giroChartData.labels
                ).toEqual(
                    ['Produto A']
                );

            }
        );

        it('deve retornar configuracao do grafico de vendas', () => {

            expect(
                component.vendasChartOptions
                    .responsive
            ).toBe(true);

        });

        it('deve retornar configuracao do grafico de fiados', () => {

            expect(
                component.fiadosChartOptions
                    .responsive
            ).toBe(true);

        });
    });

    describe('cards', () => {

        it('deve retornar cards de vendas quando a aba for vendas',
            () => {

                component.abaSelecionada = 'vendas';

                expect(
                    component.cardsAtuais
                ).toEqual(
                    component.cardsVendas
                );

            }
        );

        it('deve retornar cards de estoque quando a aba for estoque',
            () => {

                component.abaSelecionada = 'estoque';

                expect(
                    component.cardsAtuais
                ).toEqual(
                    component.cardsEstoque
                );

            }
        );

        it('deve retornar cards financeiros quando a aba for financeiro',
            () => {

                component.abaSelecionada = 'financeiro';

                expect(
                    component.cardsAtuais
                ).toEqual(
                    component.cardsFinanceiro
                );

            }
        );

        it('deve retornar cards de promoções quando a aba for promocoes',
            () => {

                component.abaSelecionada = 'promocoes';

                expect(
                    component.cardsAtuais
                ).toEqual(
                    component.cardsPromocoes
                );

            }
        );

        it('deve retornar cards de produtos quando a aba for produtos',
            () => {

                component.abaSelecionada = 'produtos';

                expect(
                    component.cardsAtuais
                ).toEqual(
                    component.cardsProdutos
                );

            }
        );

        it('deve retornar cards gerais por padrão',
            () => {

                component.abaSelecionada = 'geral';

                expect(
                    component.cardsAtuais
                ).toEqual(
                    component.cardsGeral
                );

            }
        );

        it('deve montar os cards de vendas corretamente',
            () => {

                component.dashboard = {
                    totalVendas: 2,
                    faturamento: 300
                } as never;

                component.vendas = [
                    {
                        dataVenda:
                            new Date().toISOString()
                    } as never
                ];

                const cards =
                    component.cardsVendas;

                expect(
                    cards[0].value
                ).toBe(2);

                expect(
                    cards[1].value
                ).toContain('300');

                expect(
                    cards[2].value
                ).toBe(1);

            }
        );

        it('deve retornar cards de estoque corretamente', () => {

            component.dashboard = {
                totalProdutos: 10,
                produtosComEstoqueBaixo: 2,
                produtosSemEstoque: 1
            } as any;

            expect(
                component.cardsEstoque.length
            ).toBe(3);

        });

        it('deve retornar cards financeiros corretamente', () => {

            component.dashboard = {
                fiadosEmAberto: 150,
                clientesDevedores: 2,
                faturamento: 500
            } as any;

            expect(
                component.cardsFinanceiro.length
            ).toBe(3);

        });

        it('deve retornar cards promocionais corretamente', () => {

            component.dashboard = {
                promocoesAtivas: 2,
                totalPromocoesEficientes: 1,
                totalVendasPromocionais: 10
            } as any;

            expect(
                component.cardsPromocoes.length
            ).toBe(3);

        });

        it('deve retornar cards dashboard completos', () => {

            component.dashboard = {
                totalVendas: 10,
                faturamento: 1000,
                fiadosEmAberto: 50,
                totalProdutos: 20,
                clientesDevedores: 3,
                produtosComEstoqueBaixo: 1
            } as any;

            expect(
                component.cardsDashboard.length
            ).toBe(6);

        });

        it('deve calcular corretamente produtos ativos e inativos',
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

    });

    describe('promocoes', () => {

        it('deve possuir indicadores promocionais quando houver promoções ativas',
            () => {

                component.dashboard = {
                    promocoesAtivas: 1
                } as never;

                expect(
                    component.possuiIndicadoresPromocionais
                ).toBe(true);

            }
        );

        it('não deve possuir indicadores promocionais quando não houver promoções',
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

        it('deve retornar apenas vendas promocionais',
            () => {

                component.vendas = [
                    {
                        status: 'finalizada',
                        itens: [
                            {
                                promocaoAplicada: true
                            }
                        ]
                    } as any
                ];

                expect(
                    component.vendasPromocionais.length
                ).toBe(1);

            }
        );

        it('nao deve considerar venda cancelada',
            () => {

                component.vendas = [
                    {
                        status: 'cancelada',
                        itens: [
                            {
                                promocaoAplicada: true
                            }
                        ]
                    } as any
                ];

                expect(
                    component.vendasPromocionais.length
                ).toBe(0);

            }
        );

        it('deve retornar vazio sem promocao',
            () => {

                component.vendas = [
                    {
                        status: 'finalizada',
                        itens: [
                            {
                                promocaoAplicada: false
                            }
                        ]
                    } as any
                ];

                expect(
                    component.vendasPromocionais.length
                ).toBe(0);

            }
        );

        it('deve retornar total vendas promocionais',
            () => {

                component.dashboard = {
                    totalVendasPromocionais: 12
                } as any;

                expect(
                    component.totalVendasPromocionais
                ).toBe(12);

            }
        );

        it('deve retornar faturamento promocional',
            () => {

                component.dashboard = {
                    faturamentoPromocional: 500
                } as any;

                expect(
                    component.faturamentoPromocional
                ).toBe(500);

            }
        );

        it('deve retornar total promocoes eficientes',
            () => {

                component.dashboard = {
                    totalPromocoesEficientes: 3
                } as any;

                expect(
                    component.totalPromocoesEficientes
                ).toBe(3);

            }
        );

        it('deve retornar promocoesAtivasDetalhes vazia quando dashboard nao existir', () => {

            component.dashboard = undefined;

            expect(
                component.promocoesAtivasDetalhes
            ).toEqual([]);

        });

        it('deve retornar produtos promocionais mais vendidos', () => {

            component.dashboard = {
                produtosPromocionaisMaisVendidos: [
                    { nome: 'Produto A' }
                ]
            } as any;

            expect(
                component.produtosPromocionaisMaisVendidos.length
            ).toBe(1);

        });

        it('deve retornar promocoes eficientes', () => {

            component.dashboard = {
                promocoesEficientes: [
                    { nome: 'Promo 1' }
                ]
            } as any;

            expect(
                component.promocoesEficientes.length
            ).toBe(1);

        });

        it('deve retornar promocoes de baixa efetividade', () => {

            component.dashboard = {
                promocoesBaixaEfetividade: [
                    { nome: 'Promo 1' }
                ]
            } as any;

            expect(
                component.promocoesBaixaEfetividade.length
            ).toBe(1);

        });

        it('deve retornar array vazio para promocoes eficientes sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.promocoesEficientes
            ).toEqual([]);

        });

        it('deve retornar array vazio para promocoes de baixa efetividade sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.promocoesBaixaEfetividade
            ).toEqual([]);

        });

        it('deve retornar array vazio para produtos promocionais sem dashboard', () => {

            component.dashboard = undefined;

            expect(
                component.produtosPromocionaisMaisVendidos
            ).toEqual([]);

        });

        it('deve retornar zero quando não existir dashboard',
            () => {

                component.dashboard = undefined;

                expect(
                    component.totalPromocoesAtivas
                ).toBe(0);

            }
        );
    });

    describe('descricaoPeriodo', () => {

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
    });

    describe('indicadores', () => {

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

        it('deve retornar apenas produtos com estoque baixo',
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

        it('deve retornar a quantidade correta de clientes devedores',
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

        it('deve somar corretamente os fiados em aberto',
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

        it('deve retornar a quantidade correta de produtos com estoque baixo',
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

        it('deve retornar a quantidade de vendas de hoje',
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

        it('deve somar o faturamento de hoje',
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

        it('deve retornar zero vendas quando não existir venda',
            () => {

                component.vendas = [];

                expect(
                    component.totalVendasHoje
                ).toBe(0);

            }
        );

        it('deve retornar faturamento zero sem vendas',
            () => {

                component.vendas = [];

                expect(
                    component.faturamentoHoje
                ).toBe(0);

            }
        );

        it('deve retornar total de vendas do periodo', () => {

            component.periodoSelecionado =
                'todos';

            component.vendas = [
                {} as any,
                {} as any,
                {} as any
            ];

            expect(
                component.totalVendasPeriodo
            ).toBe(3);

        });

        it('deve retornar faturamento do periodo', () => {

            component.periodoSelecionado =
                'todos';

            component.vendas = [
                {
                    valorTotal: 100
                } as any,
                {
                    valorTotal: 200
                } as any
            ];

            expect(
                component.faturamentoPeriodo
            ).toBe(300);

        });
    });
});