import { Fiados } from './fiados';
import { of } from 'rxjs';
import { vi } from 'vitest';

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

        it(
            'deve retornar Limite excedido quando o status for LIMITE_EXCEDIDO',
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

        it(
            'deve retornar Inadimplente quando o status for INADIMPLENTE',
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

        it(
            'deve retornar Devedor quando o status for DEVEDOR',
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

        it(
            'deve retornar string vazia para status desconhecido',
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

        it(
            'deve exibir alerta para cliente inadimplente',
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

        it(
            'deve exibir alerta para limite excedido',
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

        it(
            'não deve exibir alerta para cliente devedor',
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

        it(
            'deve retornar FIADO para movimentações do tipo fiado',
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

        it(
            'deve retornar PIX para pagamentos PIX',
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

        it(
            'deve retornar DINHEIRO para pagamentos em dinheiro',
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

        it(
            'deve retornar DÉBITO para pagamentos em débito',
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

        it(
            'deve retornar CRÉDITO para pagamentos em crédito',
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

        it(
            'não deve continuar quando não existir cliente selecionado',
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

        it(
            'não deve continuar quando o valor recebido for menor ou igual a zero',
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

        it(
            'deve exibir aviso quando o valor exceder o saldo devedor',
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

        it(
            'deve registrar pagamento com sucesso',
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

    }
);