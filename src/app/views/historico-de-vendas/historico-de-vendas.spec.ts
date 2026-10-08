import { HistoricoDeVendas } from './historico-de-vendas';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { Venda } from '../../core/models/venda.model';

function createVenda(
    overrides: Partial<Venda> = {}
): Venda {

    return {
        id: '1',
        status: 'finalizada',
        valorTotal: 100,
        formaPagamento: 'pix',
        usuarioNome: 'Maria',
        dataVenda: new Date().toISOString(),
        ...overrides
    } as Venda;

}

function createComponent(
    overrides: {
        vendaService?: any;
        alertService?: any;
        confirmDialogService?: any;
        cdr?: any;
    } = {}
) {

    return new HistoricoDeVendas(
        overrides.vendaService ??
        vendaServiceMock,

        overrides.alertService ??
        alertServiceMock,

        overrides.confirmDialogService ??
        confirmDialogServiceMock,

        overrides.cdr ??
        cdrMock
    );

}

const cdrMock = {
    detectChanges: vi.fn()
};

const alertServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
};

const confirmDialogServiceMock = {
    open: vi.fn()
};

const vendaServiceMock = {
    listar: vi.fn(() => of([])),
    buscarPorId: vi.fn(),
    cancelar: vi.fn()
};

describe('HistoricoDeVendas', () => {

    let component: HistoricoDeVendas;

    beforeEach(() => {

        component = createComponent();

    });

    describe('podeCancelarVenda', () => {

        it('deve permitir cancelar uma venda realizada há menos de 24 horas',
            () => {

                const venda = {
                    dataVenda: new Date(
                        Date.now()
                        - 60 * 60 * 1000
                    ).toISOString()
                } as never;

                expect(
                    component.podeCancelarVenda(
                        venda
                    )
                ).toBe(true);

            }
        );

        it('não deve permitir cancelar uma venda realizada há mais de 24 horas',
            () => {

                const venda = {
                    dataVenda: new Date(
                        Date.now()
                        - 25 * 60 * 60 * 1000
                    ).toISOString()
                } as never;

                expect(
                    component.podeCancelarVenda(
                        venda
                    )
                ).toBe(false);

            }
        );

    });

    describe('obterTextoStatus', () => {

        it('deve retornar Cancelada quando o status for cancelada',
            () => {

                expect(
                    component.obterTextoStatus(
                        'cancelada'
                    )
                ).toBe(
                    'Cancelada'
                );

            }
        );

        it('deve retornar Finalizada para qualquer outro status',
            () => {

                expect(
                    component.obterTextoStatus(
                        'finalizada'
                    )
                ).toBe(
                    'Finalizada'
                );

            }
        );

    });

    describe('obterVariantStatus', () => {

        it('deve retornar danger para venda cancelada',
            () => {

                expect(
                    component.obterVariantStatus(
                        'cancelada'
                    )
                ).toBe(
                    'danger'
                );

            }

        );

        it('deve retornar success para venda finalizada',
            () => {

                expect(
                    component.obterVariantStatus(
                        'finalizada'
                    )
                ).toBe(
                    'success'
                );

            }
        );

    });

    describe('obterIconePagamento', () => {

        it('deve retornar ícone PIX',
            () => {

                expect(
                    component.obterIconePagamento(
                        'pix'
                    )
                ).toBe('📱');

            }
        );

        it('deve retornar ícone Fiado',
            () => {

                expect(
                    component.obterIconePagamento(
                        'fiado'
                    )
                ).toBe('📒');

            }
        );

        it('deve retornar ícone de dinheiro',
            () => {

                expect(
                    component.obterIconePagamento(
                        'dinheiro'
                    )
                ).toBe('💵');

            }
        );

        it('deve retornar ícone para débito',
            () => {

                expect(
                    component.obterIconePagamento(
                        'debito'
                    )
                ).toBe('💳');

            }
        );

        it('deve retornar ícone para crédito',
            () => {

                expect(
                    component.obterIconePagamento(
                        'credito'
                    )
                ).toBe('💳');

            }
        );

        it('deve retornar vazio para forma desconhecida',
            () => {

                expect(
                    component.obterIconePagamento(
                        'boleto'
                    )
                ).toBe('');

            }
        );

    });

    describe('executarCancelamento', () => {

        it('deve exibir aviso quando tentar cancelar sem informar motivo',
            () => {

                const alertService = {
                    warning: vi.fn()
                };

                component =
                    new HistoricoDeVendas(
                        {} as never,
                        alertService as never,
                        {} as never,
                        {} as never
                    );

                component.motivoCancelamento = '';

                component.executarCancelamento();

                expect(
                    alertService.warning
                ).toHaveBeenCalledWith(
                    'Informe o motivo do cancelamento.'
                );

            }
        );

        it('não deve cancelar quando não existir venda selecionada',
            () => {

                const cancelar = vi.fn();

                const vendaService = {
                    cancelar
                };

                component =
                    new HistoricoDeVendas(
                        vendaService as never,
                        {} as never,
                        {} as never,
                        {} as never
                    );

                component.motivoCancelamento =
                    'Motivo válido';

                component.vendaSelecionada =
                    undefined;

                component.executarCancelamento();

                expect(
                    cancelar
                ).not.toHaveBeenCalled();

            }
        );

        it('deve cancelar a venda com sucesso',
            () => {

                const vendaService = {
                    cancelar: vi.fn(() => of({})),
                    listar: vi.fn(() => of([]))
                };

                const alertService = {
                    success: vi.fn(),
                    error: vi.fn(),
                    warning: vi.fn()
                };

                component =
                    new HistoricoDeVendas(
                        vendaService as never,
                        alertService as never,
                        {} as never,
                        {
                            detectChanges: vi.fn()
                        } as never
                    );

                component.vendaSelecionada =
                    createVenda();

                component.motivoCancelamento =
                    'Venda cancelada para teste';

                component.executarCancelamento();

                expect(
                    vendaService.cancelar
                ).toHaveBeenCalledWith(
                    '1',
                    'Venda cancelada para teste'
                );

                expect(
                    component.vendaSelecionada?.status
                ).toBe(
                    'cancelada'
                );

                expect(
                    component.motivoCancelamento
                ).toBe('');

                expect(
                    component.mostrarCancelamento
                ).toBe(false);

            }
        );

        it('deve tratar erro ao cancelar venda',
            () => {

                const alertService = {
                    error: vi.fn(),
                    warning: vi.fn(),
                    success: vi.fn()
                };

                const vendaService = {
                    cancelar: vi.fn(
                        () =>
                            throwError(
                                () => ({
                                    error: {
                                        message: 'Erro teste'
                                    }
                                })
                            )
                    )
                };

                component =
                    new HistoricoDeVendas(
                        vendaService as any,
                        alertService as any,
                        {} as any,
                        {} as any
                    );

                component.vendaSelecionada =
                    createVenda();

                component.motivoCancelamento =
                    'Motivo';

                component.executarCancelamento();

                expect(
                    alertService.error
                ).toHaveBeenCalledWith(
                    'Erro teste'
                );

            }
        );

        it('deve exibir mensagem padrao ao cancelar venda quando erro nao possuir mensagem',
            () => {

                const alertService = {
                    error: vi.fn(),
                    success: vi.fn(),
                    warning: vi.fn()
                };

                const vendaService = {

                    cancelar: vi.fn(
                        () =>
                            throwError(
                                () => ({})
                            )
                    )

                };

                component = createComponent({
                    vendaService,
                    alertService
                });

                component.vendaSelecionada =
                    createVenda();

                component.motivoCancelamento =
                    'Teste';

                component.executarCancelamento();

                expect(
                    alertService.error
                ).toHaveBeenCalledWith(
                    'Erro ao cancelar venda.'
                );

            }
        );

    });

    describe('abrirConfirmacaoCancelamento', () => {

        it('não deve abrir confirmação sem venda selecionada',
            () => {

                const open = vi.fn();

                component =
                    new HistoricoDeVendas(
                        {} as never,
                        {} as never,
                        {
                            open
                        } as never,
                        {} as never
                    );

                component.vendaSelecionada =
                    undefined;

                component.abrirConfirmacaoCancelamento();

                expect(
                    open
                ).not.toHaveBeenCalled();

            }
        );

        it('deve exibir aviso quando o motivo estiver vazio',
            () => {

                const alertService = {
                    warning: vi.fn()
                };

                component =
                    new HistoricoDeVendas(
                        {} as never,
                        alertService as never,
                        {} as never,
                        {} as never
                    );

                component.vendaSelecionada =
                    createVenda();

                component.motivoCancelamento = '';

                component.abrirConfirmacaoCancelamento();

                expect(
                    alertService.warning
                ).toHaveBeenCalledWith(
                    'Informe o motivo do cancelamento.'
                );

            }
        );

        it('deve abrir confirmação quando os dados forem válidos',
            () => {

                const open = vi.fn();

                component =
                    new HistoricoDeVendas(
                        {} as never,
                        {} as never,
                        {
                            open
                        } as never,
                        {} as never
                    );

                component.vendaSelecionada =
                    createVenda();

                component.motivoCancelamento =
                    'Teste';

                component.abrirConfirmacaoCancelamento();

                expect(
                    open
                ).toHaveBeenCalled();

            }
        );

        it('deve executar cancelamento ao confirmar', () => {

            let config: any;

            const open =
                vi.fn(arg => {
                    config = arg;
                });

            component =
                new HistoricoDeVendas(
                    {} as any,
                    {} as any,
                    {
                        open
                    } as any,
                    {} as any
                );

            const spy =
                vi.spyOn(
                    component,
                    'executarCancelamento'
                )
                    .mockImplementation(
                        () => { }
                    );

            component.vendaSelecionada =
                createVenda();

            component.motivoCancelamento =
                'Teste';

            component.abrirConfirmacaoCancelamento();

            config.onConfirm();

            expect(
                spy
            ).toHaveBeenCalled();

        });
    });

    describe('selecionarVenda', () => {

        it('deve selecionar venda',
            () => {

                const venda =
                    createVenda();

                const vendaService = {
                    buscarPorId: vi.fn(
                        () => of(venda)
                    )
                };

                component =
                    new HistoricoDeVendas(
                        vendaService as any,
                        {} as any,
                        {} as any,
                        {} as any
                    );

                component.selecionarVenda(
                    venda as any
                );

                expect(
                    component.vendaSelecionada
                ).toEqual(venda);

            }
        );

        it('deve limpar estado de cancelamento ao selecionar venda',
            () => {

                const venda =
                    createVenda();

                const vendaService = {
                    buscarPorId: vi.fn(
                        () => of(venda)
                    )
                };

                component =
                    new HistoricoDeVendas(
                        vendaService as any,
                        {} as any,
                        {} as any,
                        {} as any
                    );

                component.mostrarCancelamento = true;
                component.motivoCancelamento = 'teste';

                component.selecionarVenda(
                    venda as any
                );

                expect(
                    component.mostrarCancelamento
                ).toBe(false);

                expect(
                    component.motivoCancelamento
                ).toBe('');

            }
        );

        it('deve tratar erro ao carregar detalhes da venda',
            () => {

                const alertService = {
                    error: vi.fn()
                };

                const vendaService = {
                    buscarPorId: vi.fn(
                        () =>
                            throwError(
                                () => new Error()
                            )
                    )
                };

                component =
                    new HistoricoDeVendas(
                        vendaService as any,
                        alertService as any,
                        {} as any,
                        {} as any
                    );

                component.selecionarVenda({
                    id: '1'
                } as any);

                expect(
                    alertService.error
                ).toHaveBeenCalledWith(
                    'Erro ao carregar detalhes da venda.'
                );

            }
        );

        it('deve executar scroll ao selecionar venda', () => {

            vi.useFakeTimers();

            const scrollIntoView =
                vi.fn();

            vi.spyOn(
                document,
                'querySelector'
            ).mockReturnValue({
                scrollIntoView
            } as any);

            const venda =
                createVenda();

            const vendaService = {

                buscarPorId: vi.fn(
                    () => of(venda)
                )

            };

            component =
                new HistoricoDeVendas(
                    vendaService as any,
                    {} as any,
                    {} as any,
                    {} as any
                );

            component.selecionarVenda(
                venda as any
            );

            vi.runAllTimers();

            expect(
                scrollIntoView
            ).toHaveBeenCalled();

            vi.useRealTimers();

        });
    });

    describe('carregarVendas', () => {

        it('deve carregar vendas recebidas do servico',
            () => {

                const vendas = [
                    {
                        id: '1',
                        dataVenda: '2026-01-01'
                    }
                ];

                const vendaService = {
                    listar: vi.fn(
                        () => of(vendas)
                    )
                };

                component =
                    new HistoricoDeVendas(
                        vendaService as any,
                        {} as any,
                        {} as any,
                        {
                            detectChanges: vi.fn()
                        } as any
                    );

                component.carregarVendas();

                expect(
                    component.vendas
                ).toEqual(vendas);

            }
        );

        it('deve ordenar vendas da mais recente para mais antiga', () => {

            const vendaService = {

                listar: vi.fn(
                    () => of([
                        {
                            id: '1',
                            dataVenda: '2025-01-01'
                        },

                        {
                            id: '2',
                            dataVenda: '2026-01-01'
                        }
                    ])
                )

            };

            component =
                new HistoricoDeVendas(
                    vendaService as any,
                    {} as any,
                    {} as any,
                    {
                        detectChanges: vi.fn()
                    } as any
                );

            component.carregarVendas();

            expect(
                component.vendas[0].id
            ).toBe('2');

        });

        it('deve tratar erro ao carregar vendas', () => {

            const spy =
                vi.spyOn(
                    console,
                    'error'
                ).mockImplementation(
                    () => { }
                );

            const vendaService = {

                listar: vi.fn(
                    () =>
                        throwError(
                            () => new Error()
                        )
                )

            };

            component =
                new HistoricoDeVendas(
                    vendaService as any,
                    {} as any,
                    {} as any,
                    {} as any
                );

            component.carregarVendas();

            expect(
                spy
            ).toHaveBeenCalled();

        });

        it('deve executar detectChanges ao carregar vendas', () => {

            const detectChanges =
                vi.fn();

            const vendaService = {

                listar: vi.fn(
                    () => of([])
                )

            };

            component =
                new HistoricoDeVendas(
                    vendaService as any,
                    {} as any,
                    {} as any,
                    {
                        detectChanges
                    } as any
                );

            component.carregarVendas();

            expect(
                detectChanges
            ).toHaveBeenCalled();

        });
    });

    describe('ngOnInit', () => {

        it('deve carregar vendas no ngOnInit',
            () => {

                const spy =
                    vi.spyOn(
                        component,
                        'carregarVendas'
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

    });

    describe('vendasFiltradas', () => {

        it('deve filtrar vendas por forma de pagamento',
            () => {

                component.vendas = [
                    createVenda({
                        formaPagamento: 'pix'
                    }),

                    createVenda({
                        formaPagamento: 'fiado'
                    })
                ];

                component.filtroPagamento =
                    'pix';

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it('deve filtrar vendas por status',
            () => {

                component.vendas = [
                    createVenda({
                        status: 'cancelada'
                    }),

                    createVenda({
                        status: 'finalizada'
                    })
                ];

                component.filtroStatus =
                    'cancelada';

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it('deve retornar todas as vendas quando não houver filtros',
            () => {

                component.vendas = [
                    createVenda(),
                    createVenda({
                        id: '2'
                    })
                ];

                component.filtroPagamento = '';
                component.filtroStatus = '';

                expect(
                    component.vendasFiltradas.length
                ).toBe(2);

            }
        );

        it('deve aplicar filtro de status e pagamento simultaneamente',
            () => {

                component.vendas = [
                    createVenda({
                        status: 'finalizada',
                        formaPagamento: 'pix'
                    }),

                    createVenda({
                        status: 'finalizada',
                        formaPagamento: 'fiado'
                    }),

                    createVenda({
                        status: 'cancelada',
                        formaPagamento: 'pix'
                    })
                ];

                component.filtroStatus =
                    'finalizada';

                component.filtroPagamento =
                    'pix';

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it('deve retornar lista vazia quando filtro nao encontrar vendas',
            () => {

                component.vendas = [
                    createVenda({
                        formaPagamento: 'pix'
                    })
                ];

                component.filtroPagamento =
                    'fiado';

                expect(
                    component.vendasFiltradas
                ).toEqual([]);

            }
        );
    });

    describe('getters', () => {

        it('deve somar apenas vendas finalizadas no faturamento',
            () => {

                component.vendas = [
                    createVenda({
                        status: 'finalizada',
                        valorTotal: 100
                    }),

                    createVenda({
                        status: 'cancelada',
                        valorTotal: 50
                    })
                ];

                expect(
                    component.faturamentoTotal
                ).toBe(100);

            }
        );

        it('deve calcular o ticket médio',
            () => {

                component.vendas = [
                    createVenda({
                        valorTotal: 100
                    }),

                    createVenda({
                        valorTotal: 200
                    })
                ];

                expect(
                    component.ticketMedio
                ).toBe(150);

            }
        );

        it('deve retornar zero de ticket medio sem vendas',
            () => {

                component.vendas = [];

                expect(
                    component.ticketMedio
                ).toBe(0);

            }
        );

        it('deve somar corretamente os fiados',
            () => {

                component.vendas = [
                    createVenda({
                        formaPagamento: 'fiado',
                        valorTotal: 100
                    }),

                    createVenda({
                        formaPagamento: 'pix',
                        valorTotal: 50
                    }),

                    createVenda({
                        formaPagamento: 'fiado',
                        valorTotal: 200
                    })
                ];

                expect(
                    component.totalFiados
                ).toBe(300);

            }
        );

        it('deve retornar a quantidade de vendas canceladas',
            () => {

                component.vendas = [
                    createVenda({
                        status: 'cancelada'
                    }),

                    createVenda({
                        status: 'cancelada'
                    }),

                    createVenda({
                        status: 'finalizada'
                    })
                ];

                expect(
                    component.totalCanceladas
                ).toBe(2);

            }
        );

        it('deve retornar total de vendas filtradas',
            () => {

                component.vendas = [
                    createVenda(),
                    createVenda({ id: '2' }),
                    createVenda({ id: '3' })
                ];

                expect(
                    component.totalVendas
                ).toBe(3);

            }
        );

        it('deve retornar total de vendas', () => {

            component.vendas = [
                createVenda({
                    formaPagamento: 'pix'
                }),

                createVenda({
                    formaPagamento: 'fiado'
                })
            ];

            component.filtroPagamento = 'pix';

            expect(
                component.totalVendas
            ).toBe(1);

        });

        it('deve retornar zero quando nao houver vendas finalizadas', () => {

            component.vendas = [
                createVenda({
                    status: 'cancelada'
                })
            ];

            expect(
                component.faturamentoTotal
            ).toBe(0);

        });

        it('deve retornar zero quando nao houver vendas fiadas', () => {

            component.vendas = [
                createVenda({
                    formaPagamento: 'pix'
                })
            ];

            expect(
                component.totalFiados
            ).toBe(0);

        });

        it('deve retornar zero canceladas quando nao houver vendas canceladas',
            () => {

                component.vendas = [
                    createVenda()
                ];

                expect(
                    component.totalCanceladas
                ).toBe(0);

            }
        );

    });

    describe('cardsHistorico', () => {

        it('deve montar card de vendas',
            () => {

                const cards =
                    component.cardsHistorico;

                expect(
                    cards[0].title
                ).toBe('Vendas');

            }
        );

        it('deve retornar cinco cards',
            () => {

                expect(
                    component.cardsHistorico.length
                ).toBe(5);

            }
        );

        it('deve montar os valores dos cards', () => {

            component.vendas = [
                createVenda({
                    formaPagamento: 'fiado'
                })
            ];

            const cards =
                component.cardsHistorico;

            expect(
                cards.length
            ).toBe(5);

            expect(
                cards[0].value
            ).toBe(1);

        });

        it('deve montar card de canceladas',
            () => {

                component.vendas = [
                    createVenda({
                        status: 'cancelada'
                    })
                ];

                const card =
                    component.cardsHistorico[4];

                expect(
                    card.title
                ).toBe(
                    'Canceladas'
                );

                expect(
                    card.value
                ).toBe(1);

            }
        );
    });

























}
);