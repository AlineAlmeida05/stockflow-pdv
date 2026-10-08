import { Fiados } from './fiados';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

beforeEach(() => {

    vi.spyOn(
        console,
        'error'
    ).mockImplementation(
        () => { }
    );

});

describe(
    'Fiados',
    () => {

        let component: Fiados;

        beforeEach(() => {

            component =
                new Fiados(
                    {} as never,
                    {} as never,
                    {} as never,
                    {} as never,
                    {} as never
                );

        });

        it('deve retornar Limite excedido quando o status for LIMITE_EXCEDIDO',
            () => {

                component.resumosClientes = {
                    '1': {
                        status: 'LIMITE_EXCEDIDO'
                    } as never
                };

                expect(
                    component.formatarStatus('1')
                ).toBe(
                    '⚠️ Limite excedido'
                );

            }
        );

        it('deve retornar Inadimplente quando o status for INADIMPLENTE',
            () => {

                component.resumosClientes = {
                    '1': {
                        status: 'INADIMPLENTE'
                    } as never
                };

                expect(
                    component.formatarStatus('1')
                ).toBe(
                    '🔴 Inadimplente'
                );

            }
        );

        it('deve retornar Devedor quando o status for DEVEDOR',
            () => {

                component.resumosClientes = {
                    '1': {
                        status: 'DEVEDOR'
                    } as never
                };

                expect(
                    component.formatarStatus('1')
                ).toBe(
                    '🟠 Devedor'
                );

            }
        );

        it('deve retornar string vazia para status desconhecido',
            () => {

                component.resumosClientes = {
                    '1': {
                        status: 'EM_DIA'
                    } as never
                };

                expect(
                    component.formatarStatus('1')
                ).toBe(
                    ''
                );

            }
        );

        it('deve exibir alerta para cliente inadimplente',
            () => {

                component.resumosClientes = {
                    '1': {
                        status: 'INADIMPLENTE'
                    } as never
                };

                expect(
                    component.deveExibirAlertaFinanceiro('1')
                ).toBe(true);

            }
        );

        it('deve exibir alerta para limite excedido',
            () => {

                component.resumosClientes = {
                    '1': {
                        status: 'LIMITE_EXCEDIDO'
                    } as never
                };

                expect(
                    component.deveExibirAlertaFinanceiro('1')
                ).toBe(true);

            }
        );

        it('não deve exibir alerta para cliente devedor',
            () => {

                component.resumosClientes = {
                    '1': {
                        status: 'DEVEDOR'
                    } as never
                };

                expect(
                    component.deveExibirAlertaFinanceiro('1')
                ).toBe(false);

            }
        );

        it('deve retornar FIADO para movimentações do tipo fiado',
            () => {

                expect(
                    component.obterDescricaoMovimento({
                        tipo: 'fiado'
                    })
                ).toBe(
                    '📒 FIADO'
                );

            }
        );

        it('deve retornar PIX para pagamentos PIX',
            () => {

                expect(
                    component.obterDescricaoMovimento({
                        tipo: 'pagamento',
                        formaPagamento: 'pix'
                    })
                ).toBe(
                    '📱 PIX'
                );

            }
        );

        it('deve retornar DINHEIRO para pagamentos em dinheiro',
            () => {

                expect(
                    component.obterDescricaoMovimento({
                        tipo: 'pagamento',
                        formaPagamento: 'dinheiro'
                    })
                ).toBe(
                    '💵 DINHEIRO'
                );

            }
        );

        it('deve retornar DÉBITO para pagamentos em débito',
            () => {

                expect(
                    component.obterDescricaoMovimento({
                        tipo: 'pagamento',
                        formaPagamento: 'debito'
                    })
                ).toBe(
                    '💳 DÉBITO'
                );

            }
        );

        it('deve retornar CRÉDITO para pagamentos em crédito',
            () => {

                expect(
                    component.obterDescricaoMovimento({
                        tipo: 'pagamento',
                        formaPagamento: 'credito'
                    })
                ).toBe(
                    '💳 CRÉDITO'
                );

            }
        );

        it('não deve continuar quando não existir cliente selecionado',
            () => {

                const pagamentoService = {
                    salvar: vi.fn()
                };

                component =
                    new Fiados(
                        {} as never,
                        {} as never,
                        pagamentoService as never,
                        {} as never,
                        {} as never
                    );

                component.cliente = undefined;

                component.valorRecebido = 100;

                component.confirmarRecebimento();

                expect(
                    pagamentoService.salvar
                ).not.toHaveBeenCalled();

            }
        );

        it('não deve continuar quando o valor recebido for menor ou igual a zero',
            () => {

                const pagamentoService = {
                    salvar: vi.fn()
                };

                component =
                    new Fiados(
                        {} as never,
                        {} as never,
                        pagamentoService as never,
                        {} as never,
                        {} as never
                    );

                component.cliente = {
                    id: '1'
                } as never;

                component.valorRecebido = 0;

                component.confirmarRecebimento();

                expect(
                    pagamentoService.salvar
                ).not.toHaveBeenCalled();

            }
        );

        it('deve exibir aviso quando o valor exceder o saldo devedor',
            () => {

                const alertService = {
                    warning: vi.fn()
                };

                component =
                    new Fiados(
                        {} as never,
                        {} as never,
                        {} as never,
                        alertService as never,
                        {} as never
                    );

                component.cliente = {
                    id: '1'
                } as never;

                component.clienteResumo = {
                    saldoDevedor: 100
                } as never;

                component.valorRecebido = 150;

                component.confirmarRecebimento();

                expect(
                    alertService.warning
                ).toHaveBeenCalledWith(
                    'O valor informado excede o saldo devedor.'
                );

            }
        );

        it('deve registrar pagamento com sucesso',
            () => {

                const clienteService = {
                    listar: vi.fn(() => of([]))
                };

                const fiadoService = {
                    listar: vi.fn(() => of([]))
                };

                const pagamentoService = {
                    salvar: vi.fn(() => of({})),
                    listar: vi.fn(() => of([]))
                };

                const alertService = {
                    success: vi.fn(),
                    error: vi.fn(),
                    warning: vi.fn()
                };

                component =
                    new Fiados(
                        clienteService as never,
                        fiadoService as never,
                        pagamentoService as never,
                        alertService as never,
                        {
                            detectChanges: vi.fn()
                        } as never
                    );

                component.cliente = {
                    id: '1'
                } as never;

                component.clienteResumo = {
                    saldoDevedor: 500
                } as never;

                component.valorRecebido = 100;

                component.formaPagamento = 'pix';

                component.confirmarRecebimento();

                expect(
                    pagamentoService.salvar
                ).toHaveBeenCalled();

                expect(
                    alertService.success
                ).toHaveBeenCalledWith(
                    'Pagamento registrado com sucesso.'
                );
                expect(
                    component.valorRecebido
                ).toBe(0);

                expect(
                    component.formaPagamento
                ).toBe('pix');

                expect(
                    component.mostrarRecebimento
                ).toBe(false);

            }
        );

        it('deve carregar dados no ngOnInit',
            () => {

                const spy =
                    vi.spyOn(
                        component,
                        'carregarDados'
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

        it('deve retornar saldo devedor atual',
            () => {

                component.clienteResumo = {
                    saldoDevedor: 500
                } as any;

                expect(
                    component.saldoDevedorAtual
                ).toBe(500);

            }
        );

        it('deve retornar zero sem resumo',
            () => {

                component.clienteResumo =
                    undefined;

                expect(
                    component.saldoDevedorAtual
                ).toBe(0);

            }
        );

        it('deve retornar dias sem pagamento',
            () => {

                component.clienteResumo = {
                    diasSemPagamento: 20
                } as any;

                expect(
                    component.diasSemPagamento
                ).toBe(20);

            }
        );

        it('deve retornar zero sem resumo',
            () => {

                component.clienteResumo =
                    undefined;

                expect(
                    component.diasSemPagamento
                ).toBe(0);

            }
        );

        it('deve retornar status vindo do resumo',
            () => {

                component.clienteResumo = {
                    status: 'DEVEDOR'
                } as any;

                expect(
                    component.statusFinanceiro
                ).toBe('DEVEDOR');

            }
        );

        it('deve retornar EM_DIA sem resumo',
            () => {

                component.clienteResumo =
                    undefined;

                expect(
                    component.statusFinanceiro
                ).toBe('EM_DIA');

            }
        );

        it('deve formatar limite excedido no resumo',
            () => {

                component.clienteResumo = {
                    status: 'LIMITE_EXCEDIDO'
                } as any;

                expect(
                    component.formatarStatusResumo()
                ).toBe(
                    '⚠️ Limite excedido'
                );

            }
        );

        it('deve formatar inadimplente no resumo',
            () => {

                component.clienteResumo = {
                    status: 'INADIMPLENTE'
                } as any;

                expect(
                    component.formatarStatusResumo()
                ).toBe(
                    '🔴 Inadimplente'
                );

            }
        );

        it('deve formatar devedor no resumo',
            () => {

                component.clienteResumo = {
                    status: 'DEVEDOR'
                } as any;

                expect(
                    component.formatarStatusResumo()
                ).toBe(
                    '🟠 Devedor'
                );

            }
        );

        it('deve retornar vazio para status padrao no resumo',
            () => {

                component.clienteResumo = {
                    status: 'EM_DIA'
                } as any;

                expect(
                    component.formatarStatusResumo()
                ).toBe('');

            }
        );

        it('deve exibir alerta resumo para inadimplente',
            () => {

                component.clienteResumo = {
                    status: 'INADIMPLENTE'
                } as any;

                expect(
                    component.deveExibirAlertaFinanceiroResumo()
                ).toBe(true);

            }
        );

        it('deve exibir alerta resumo para limite excedido',
            () => {

                component.clienteResumo = {
                    status: 'LIMITE_EXCEDIDO'
                } as any;

                expect(
                    component.deveExibirAlertaFinanceiroResumo()
                ).toBe(true);

            }
        );

        it('nao deve exibir alerta resumo para devedor',
            () => {

                component.clienteResumo = {
                    status: 'DEVEDOR'
                } as any;

                expect(
                    component.deveExibirAlertaFinanceiroResumo()
                ).toBe(false);

            }
        );

        it('deve retornar resumo do cliente',
            () => {

                const resumo = {
                    saldoDevedor: 100
                };

                component.resumosClientes = {
                    '1': resumo as any
                };

                expect(
                    component.obterResumoCliente(
                        '1'
                    )
                ).toEqual(
                    resumo
                );

            }
        );

        it('deve retornar undefined quando nao existir resumo',
            () => {

                expect(
                    component.obterResumoCliente(
                        '999'
                    )
                ).toBeUndefined();

            }
        );

        it('deve retornar dias sem pagamento do cliente',
            () => {

                component.resumosClientes = {
                    '1': {
                        diasSemPagamento: 15
                    } as any
                };

                expect(
                    component.obterDiasSemPagamento(
                        '1'
                    )
                ).toBe(15);

            }
        );

        it('deve retornar zero quando nao existir resumo',
            () => {

                expect(
                    component.obterDiasSemPagamento(
                        '1'
                    )
                ).toBe(0);

            }
        );

        it('deve retornar apenas clientes devedores',
            () => {

                component.clientes = [
                    {
                        id: '1'
                    } as any,
                    {
                        id: '2'
                    } as any
                ];

                component.resumosClientes = {
                    '1': {
                        saldoDevedor: 100
                    } as any,
                    '2': {
                        saldoDevedor: 0
                    } as any
                };

                expect(
                    component.clientesDevedores.length
                ).toBe(1);

            }
        );

        it('deve retornar vazio sem cliente selecionado',
            () => {

                component.cliente =
                    undefined;

                expect(
                    component.obterFiadosCliente()
                ).toEqual([]);

            }
        );

        it('deve retornar apenas os fiados do cliente',
            () => {

                component.cliente = {
                    id: '1'
                } as any;

                component.fiados = [
                    {
                        clienteId: '1'
                    } as any,
                    {
                        clienteId: '2'
                    } as any
                ];

                expect(
                    component.obterFiadosCliente().length
                ).toBe(1);

            }
        );

        it('deve retornar vazio sem cliente selecionado',
            () => {

                component.cliente =
                    undefined;

                expect(
                    component.obterExtratoCliente()
                ).toEqual([]);

            }
        );

        it('deve combinar fiados e pagamentos',
            () => {

                component.cliente = {
                    id: '1'
                } as any;

                component.fiados = [
                    {
                        clienteId: '1',
                        dataLancamento:
                            new Date().toISOString(),
                        valorTotal: 100
                    } as any
                ];

                component.pagamentos = [
                    {
                        clienteId: '1',
                        dataPagamento:
                            new Date().toISOString(),
                        valorPago: 50
                    } as any
                ];

                expect(
                    component.obterExtratoCliente().length
                ).toBe(2);

            }
        );

        it('deve filtrar clientes devedores por nome',
            () => {

                component.clientes = [
                    {
                        id: '1',
                        nome: 'Maria'
                    } as any
                ];

                component.resumosClientes = {
                    '1': {
                        saldoDevedor: 100
                    } as any
                };

                component.textoBusca =
                    'Maria';

                expect(
                    component.clientesDevedoresFiltrados.length
                ).toBe(1);

            }
        );

        it('nao deve abrir whatsapp sem cliente',
            () => {

                const spy =
                    vi.spyOn(
                        window,
                        'open'
                    );

                component.cliente =
                    undefined;

                component.cobrarViaWhatsapp(
                    {} as any
                );

                expect(
                    spy
                ).not.toHaveBeenCalled();

            }
        );

        it('deve abrir whatsapp',
            () => {

                const spy =
                    vi.spyOn(
                        window,
                        'open'
                    )
                        .mockImplementation(
                            () => null
                        );

                const cliente = {
                    nome: 'Maria',
                    telefone: '(11)99999-9999'
                } as any;

                component.cliente = cliente;

                component.clienteResumo = {
                    saldoDevedor: 100,
                    diasSemPagamento: 10
                } as any;

                component.cobrarViaWhatsapp(
                    cliente
                );

                expect(
                    spy
                ).toHaveBeenCalled();

            }
        );

        it('deve tratar erro ao registrar pagamento', () => {

            const alertService = {
                success: vi.fn(),
                error: vi.fn(),
                warning: vi.fn()
            };

            const pagamentoService = {
                salvar: vi.fn(
                    () => throwError(() => new Error())
                )
            };

            component =
                new Fiados(
                    {} as any,
                    {} as any,
                    pagamentoService as any,
                    alertService as any,
                    {} as any
                );

            component.cliente =
                { id: '1' } as any;

            component.clienteResumo =
                { saldoDevedor: 200 } as any;

            component.valorRecebido = 100;

            component.confirmarRecebimento();

            expect(
                alertService.error
            ).toHaveBeenCalledWith(
                'Erro ao registrar pagamento.'
            );

        });

        it('deve carregar clientes fiados e pagamentos', () => {

            const clienteService = {
                listar: vi.fn(() =>
                    of([
                        { id: '1' }
                    ])
                ),
                obterResumo: vi.fn(() =>
                    of({
                        saldoDevedor: 100
                    })
                )
            };

            const fiadoService = {
                listar: vi.fn(() =>
                    of([
                        { id: '10' }
                    ])
                )
            };

            const pagamentoService = {
                listar: vi.fn(() =>
                    of([
                        { id: '20' }
                    ])
                )
            };

            component =
                new Fiados(
                    clienteService as any,
                    fiadoService as any,
                    pagamentoService as any,
                    {} as any,
                    {
                        detectChanges: vi.fn()
                    } as any
                );

            component.carregarDados();

            expect(
                component.clientes.length
            ).toBe(1);

            expect(
                component.fiados.length
            ).toBe(1);

            expect(
                component.pagamentos.length
            ).toBe(1);

        });

        it('deve tratar erro ao carregar clientes', () => {

            const spy =
                vi.spyOn(
                    console,
                    'error'
                );

            const clienteService = {
                listar: vi.fn(
                    () =>
                        throwError(
                            () => new Error()
                        )
                )
            };

            const fiadoService = {
                listar: vi.fn(
                    () => of([])
                )
            };

            const pagamentoService = {
                listar: vi.fn(
                    () => of([])
                )
            };

            component =
                new Fiados(
                    clienteService as any,
                    fiadoService as any,
                    pagamentoService as any,
                    {} as any,
                    {
                        detectChanges: vi.fn()
                    } as any
                );

            component.carregarDados();

            expect(
                spy
            ).toHaveBeenCalled();

        });

        it('deve selecionar cliente e carregar resumo', () => {

            const cliente = {
                id: '1'
            };

            const resumo = {
                saldoDevedor: 500
            };

            const clienteService = {
                obterResumo: vi.fn(
                    () => of(resumo)
                )
            };

            component =
                new Fiados(
                    clienteService as any,
                    {} as any,
                    {} as any,
                    {} as any,
                    {
                        detectChanges: vi.fn()
                    } as any
                );

            component.selecionarCliente(
                cliente as any
            );

            expect(
                component.cliente
            ).toEqual(cliente);

            expect(
                component.clienteResumo
            ).toEqual(resumo);

        });

        it('deve tratar erro ao carregar resumo do cliente', () => {

            const spy =
                vi.spyOn(
                    console,
                    'error'
                );

            const clienteService = {

                obterResumo: vi.fn(
                    () =>
                        throwError(
                            () => new Error()
                        )
                )

            };

            component =
                new Fiados(
                    clienteService as any,
                    {} as any,
                    {} as any,
                    {} as any,
                    {} as any
                );

            component.selecionarCliente({
                id: '1'
            } as any);

            expect(
                spy
            ).toHaveBeenCalled();

        });

        it('deve ordenar clientes devedores pelo maior saldo', () => {

            component.clientes = [
                {
                    id: '1'
                } as any,
                {
                    id: '2'
                } as any
            ];

            component.resumosClientes = {

                '1': {
                    saldoDevedor: 100
                } as any,

                '2': {
                    saldoDevedor: 500
                } as any

            };

            expect(
                component.clientesDevedores[0]
                    .id
            ).toBe('2');

        });

        it('deve ordenar fiados mais recentes primeiro', () => {

            component.cliente =
                { id: '1' } as any;

            component.fiados = [

                {
                    clienteId: '1',
                    dataLancamento:
                        '2025-01-01'
                } as any,

                {
                    clienteId: '1',
                    dataLancamento:
                        '2026-01-01'
                } as any

            ];

            expect(
                component
                    .obterFiadosCliente()[0]
                    .dataLancamento
            ).toBe('2026-01-01');

        });

        it('deve ordenar extrato por data decrescente', () => {

            component.cliente =
                { id: '1' } as any;

            component.fiados = [

                {
                    clienteId: '1',
                    dataLancamento:
                        '2025-01-01',
                    valorTotal: 100
                } as any

            ];

            component.pagamentos = [

                {
                    clienteId: '1',
                    dataPagamento:
                        '2026-01-01',
                    valorPago: 50
                } as any

            ];

            expect(
                component
                    .obterExtratoCliente()[0]
                    .tipo
            ).toBe('pagamento');

        });

        afterEach(() => {

            vi.restoreAllMocks();

        });
    }


);