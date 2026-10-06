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

        it(
            'deve somar apenas vendas finalizadas no faturamento',
            () => {

                component.vendas = [
                    {
                        status: 'finalizada',
                        valorTotal: 100
                    } as never,

                    {
                        status: 'cancelada',
                        valorTotal: 50
                    } as never
                ];

                expect(
                    component.faturamentoTotal
                ).toBe(100);

            }
        );

        it(
            'deve calcular o ticket médio',
            () => {

                component.vendas = [
                    {
                        status: 'finalizada',
                        valorTotal: 100
                    } as never,

                    {
                        status: 'finalizada',
                        valorTotal: 200
                    } as never
                ];

                expect(
                    component.ticketMedio
                ).toBe(150);

            }
        );

        it(
            'deve somar corretamente os fiados',
            () => {

                component.vendas = [
                    {
                        formaPagamento: 'fiado',
                        valorTotal: 100
                    } as never,

                    {
                        formaPagamento: 'pix',
                        valorTotal: 50
                    } as never,

                    {
                        formaPagamento: 'fiado',
                        valorTotal: 200
                    } as never
                ];

                expect(
                    component.totalFiados
                ).toBe(300);

            }
        );

        it(
            'deve retornar a quantidade de vendas canceladas',
            () => {

                component.vendas = [
                    {
                        status: 'cancelada'
                    } as never,

                    {
                        status: 'cancelada'
                    } as never,

                    {
                        status: 'finalizada'
                    } as never
                ];

                expect(
                    component.totalCanceladas
                ).toBe(2);

            }
        );

        it(
            'deve retornar danger para venda cancelada',
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

        it(
            'deve retornar success para venda finalizada',
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

        it(
            'deve filtrar vendas por forma de pagamento',
            () => {

                component.vendas = [
                    {
                        formaPagamento: 'pix'
                    } as never,

                    {
                        formaPagamento: 'fiado'
                    } as never
                ];

                component.filtroPagamento =
                    'pix';

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );

        it(
            'deve filtrar vendas por status',
            () => {

                component.vendas = [
                    {
                        status: 'cancelada'
                    } as never,

                    {
                        status: 'finalizada'
                    } as never
                ];

                component.filtroStatus =
                    'cancelada';

                expect(
                    component.vendasFiltradas.length
                ).toBe(1);

            }
        );
    }
);