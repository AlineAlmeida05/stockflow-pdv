import { Fiados } from './fiados';

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

    }
);