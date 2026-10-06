import { HistoricoDeVendas } from './historico-de-vendas';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Venda } from '../../core/models/venda.model';

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

        it(
            'deve exibir aviso quando tentar cancelar sem informar motivo',
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

        it(
            'não deve cancelar quando não existir venda selecionada',
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

        it(
            'deve cancelar a venda com sucesso',
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

                component.vendaSelecionada = {
                    id: '1',
                    status: 'finalizada',
                    valorTotal: 100
                } as Venda;

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

        it(
            'deve retornar ícone PIX',
            () => {

                expect(
                    component.obterIconePagamento(
                        'pix'
                    )
                ).toBe('📱');

            }
        );

        it(
            'deve retornar ícone Fiado',
            () => {

                expect(
                    component.obterIconePagamento(
                        'fiado'
                    )
                ).toBe('📒');

            }
        );

        

    }
);