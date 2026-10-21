import { HistoricoDeVendas } from './historico-de-vendas';

describe(
    'HistoricoDeVendas',
    () => {

        let component: HistoricoDeVendas;

        beforeEach(() => {

            component =
                new HistoricoDeVendas(
                    {} as never,
                    {} as never,
                    {} as never,
                    {} as never
                );

        });

        it(
            'deve permitir cancelar uma venda realizada há menos de 24 horas',
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

        it(
            'não deve permitir cancelar uma venda realizada há mais de 24 horas',
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

        it(
            'deve retornar Cancelada quando o status for cancelada',
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

        it(
            'deve retornar Finalizada para qualquer outro status',
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

    }
);