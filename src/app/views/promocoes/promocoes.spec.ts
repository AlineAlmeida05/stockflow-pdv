import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { vi } from 'vitest';
import { throwError } from 'rxjs';
import { Promocoes } from './promocoes';
import { ProdutoService } from '../../core/services/produto.service';
import { PromocaoService } from '../../core/services/promocao.service';
import { AlertService } from '../../core/services/alert.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

describe('Promocoes', () => {

    let component: Promocoes;
    let fixture: ComponentFixture<Promocoes>;

    let produtoServiceMock: {
        listar: ReturnType<typeof vi.fn>;
    };

    let promocaoServiceMock: {
        listar: ReturnType<typeof vi.fn>;
        listarPainel: ReturnType<typeof vi.fn>;
        criar: ReturnType<typeof vi.fn>;
        encerrar: ReturnType<typeof vi.fn>;
    };

    let alertServiceMock: {
        success: ReturnType<typeof vi.fn>;
        warning: ReturnType<typeof vi.fn>;
        error: ReturnType<typeof vi.fn>;
    };

    let notificacaoServiceMock: {
        notificarAtualizacaoBadges: ReturnType<typeof vi.fn>;
        listarBadges: ReturnType<typeof vi.fn>;
        badgesAtualizados$: any;
    };

    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    beforeEach(async () => {

        produtoServiceMock = {
            listar: vi.fn().mockReturnValue(
                of([])
            )
        };

        promocaoServiceMock = {
            listar: vi.fn().mockReturnValue(
                of([])
            ),

            listarPainel: vi.fn().mockReturnValue(
                of({
                    pendentes: [],
                    ativas: []
                })
            ),

            criar: vi.fn().mockReturnValue(
                of({})
            ),

            encerrar: vi.fn().mockReturnValue(
                of({})
            )
        };

        alertServiceMock = {
            success: vi.fn(),
            warning: vi.fn(),
            error: vi.fn()
        };

        notificacaoServiceMock = {

            notificarAtualizacaoBadges: vi.fn(),

            listarBadges: vi.fn().mockReturnValue(
                of([])
            ),

            badgesAtualizados$: new Subject<void>()

        };


        await TestBed.configureTestingModule({
            imports: [
                Promocoes
            ],
            providers: [
                {
                    provide: ProdutoService,
                    useValue: produtoServiceMock
                },
                {
                    provide: PromocaoService,
                    useValue: promocaoServiceMock
                },
                {
                    provide: AlertService,
                    useValue: alertServiceMock
                },
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(
            Promocoes
        );

        component = fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente',
        () => {

            expect(component)
                .toBeTruthy();

        }
    );

    it('deve carregar produtos no ngOnInit',
        () => {

            expect(
                produtoServiceMock.listar
            ).toHaveBeenCalled();

        }
    );

    it('deve carregar promocoes no ngOnInit',
        () => {

            expect(
                promocaoServiceMock.listar
            ).toHaveBeenCalled();

        }
    );

    it('deve carregar painel de promocoes no ngOnInit',
        () => {

            expect(
                promocaoServiceMock.listarPainel
            ).toHaveBeenCalled();

        }
    );

    it('deve carregar listas recebidas dos servicos',
        () => {

            const produtos = [
                {
                    id: '1',
                    nome: 'Produto 1'
                }
            ] as any;

            const promocoes = [
                {
                    id: '1'
                }
            ] as any;

            produtoServiceMock.listar.mockReturnValue(
                of(produtos)
            );

            promocaoServiceMock.listar.mockReturnValue(
                of(promocoes)
            );

            promocaoServiceMock.listarPainel.mockReturnValue(
                of({
                    pendentes: [
                        {
                            id: '1'
                        }
                    ],
                    ativas: [
                        {
                            id: '2'
                        }
                    ]
                })
            );

            component.ngOnInit();

            expect(component.produtos)
                .toEqual(produtos);

            expect(component.promocoes)
                .toEqual(promocoes);

            expect(component.pendentes.length)
                .toBe(1);

            expect(component.ativas.length)
                .toBe(1);

        }
    );

    it('deve selecionar produto',
        () => {

            const produto = {
                id: '1',
                nome: 'Produto Teste'
            } as any;

            component.selecionarProduto(
                produto
            );

            expect(
                component.produtoSelecionado
            ).toBe(produto);

        }
    );

    it('deve retornar promocao ativa',
        () => {

            const promocao = {
                id: '1',
                ativa: true,
                produto: {
                    id: '1'
                }
            } as any;

            component.promocoes = [
                promocao
            ];

            expect(
                component.obterPromocaoAtiva(
                    '1'
                )
            ).toEqual(promocao);

        }
    );

    it('deve retornar undefined quando nao existir promocao ativa',
        () => {

            component.promocoes = [];

            expect(
                component.obterPromocaoAtiva(
                    '1'
                )
            ).toBeUndefined();

        }
    );

    it('deve combinar pendentes e ativas',
        () => {

            component.pendentes = [
                { id: '1' } as any
            ];

            component.ativas = [
                { id: '2' } as any
            ];

            expect(
                component.promocoesPainel
            ).toHaveLength(2);

        }
    );

    it('deve retornar produtos pendentes',
        () => {

            component.produtos = [
                {
                    id: '1',
                    nome: 'Produto 1'
                } as any
            ];

            component.pendentes = [
                {
                    id: '1'
                } as any
            ];

            expect(
                component.produtosPendentes
            ).toHaveLength(1);

        }
    );

    it('deve retornar produtos ativos',
        () => {

            component.produtos = [
                {
                    id: '2',
                    nome: 'Produto 2'
                } as any
            ];

            component.ativas = [
                {
                    id: '2'
                } as any
            ];

            expect(
                component.produtosAtivos
            ).toHaveLength(1);

        }
    );

    it('deve retornar giro alto',
        () => {

            component.ativas = [
                {
                    id: '1',
                    percentualGiro: 80
                } as any
            ];

            expect(
                component.obterStatusGiro('1')
            ).toBe('Giro Alto');

        }
    );

    it('deve retornar giro medio',
        () => {

            component.ativas = [
                {
                    id: '1',
                    percentualGiro: 50
                } as any
            ];

            expect(
                component.obterStatusGiro('1')
            ).toBe('Giro Médio');

        }
    );

    it('deve retornar giro baixo',
        () => {

            component.ativas = [
                {
                    id: '1',
                    percentualGiro: 20
                } as any
            ];

            expect(
                component.obterStatusGiro('1')
            ).toBe('Giro Baixo');

        }
    );

    it('deve retornar variant success para giro alto', () => {
        component.ativas = [
            {
                id: '1',
                percentualGiro: 80
            } as any
        ];

        expect(
            component.obterVariantGiro('1')
        ).toBe('success');
    });

    it('deve retornar variant warning para giro medio', () => {
        component.ativas = [
            {
                id: '1',
                percentualGiro: 50
            } as any
        ];

        expect(
            component.obterVariantGiro('1')
        ).toBe('warning');
    });

    it('deve retornar variant danger para giro baixo', () => {
        component.ativas = [
            {
                id: '1',
                percentualGiro: 10
            } as any
        ];

        expect(
            component.obterVariantGiro('1')
        ).toBe('danger');
    });

    it('deve retornar produto parado', () => {

        component.ativas = [
            {
                id: '1',
                diasEstoque: 35
            } as any
        ];

        expect(
            component.obterStatusEstoque('1')
        ).toBe('Produto Parado');

    });

    it('deve retornar atencao', () => {

        component.ativas = [
            {
                id: '1',
                diasEstoque: 20
            } as any
        ];

        expect(
            component.obterStatusEstoque('1')
        ).toBe('Atenção');

    });

    it('deve retornar recente', () => {

        component.ativas = [
            {
                id: '1',
                diasEstoque: 10
            } as any
        ];

        expect(
            component.obterStatusEstoque('1')
        ).toBe('Recente');

    });

    it('deve retornar variant danger para produto parado', () => {

        component.ativas = [
            {
                id: '1',
                diasEstoque: 35
            } as any
        ];

        expect(
            component.obterVariantEstoque('1')
        ).toBe('danger');

    });

    it('deve retornar variant warning para produto em atencao', () => {

        component.ativas = [
            {
                id: '1',
                diasEstoque: 20
            } as any
        ];

        expect(
            component.obterVariantEstoque('1')
        ).toBe('warning');

    });

    it('deve retornar variant success para produto recente', () => {

        component.ativas = [
            {
                id: '1',
                diasEstoque: 10
            } as any
        ];

        expect(
            component.obterVariantEstoque('1')
        ).toBe('success');

    });

    it('deve retornar prioridade alta', () => {

        component.ativas = [
            {
                id: '1',
                prioridade: 'ALTA'
            } as any
        ];

        expect(
            component.obterPrioridade('1')
        ).toBe('Prioridade Alta');

    });

    it('deve retornar prioridade media', () => {

        component.ativas = [
            {
                id: '1',
                prioridade: 'MEDIA'
            } as any
        ];

        expect(
            component.obterPrioridade('1')
        ).toBe('Prioridade Média');

    });

    it('deve retornar prioridade baixa', () => {

        component.ativas = [
            {
                id: '1',
                prioridade: 'BAIXA'
            } as any
        ];

        expect(
            component.obterPrioridade('1')
        ).toBe('Prioridade Baixa');

    });

    it('deve retornar variant danger para prioridade alta', () => {

        component.ativas = [
            {
                id: '1',
                prioridade: 'ALTA'
            } as any
        ];

        expect(
            component.obterVariantPrioridade('1')
        ).toBe('danger');

    });

    it('deve retornar variant warning para prioridade media', () => {

        component.ativas = [
            {
                id: '1',
                prioridade: 'MEDIA'
            } as any
        ];

        expect(
            component.obterVariantPrioridade('1')
        ).toBe('warning');

    });

    it('deve retornar variant success para prioridade baixa', () => {

        component.ativas = [
            {
                id: '1',
                prioridade: 'BAIXA'
            } as any
        ];

        expect(
            component.obterVariantPrioridade('1')
        ).toBe('success');

    });

    it('nao deve ativar promocao para produto inativo',
        () => {

            const produto = {
                id: '1',
                ativo: false
            } as any;

            component.ativarPromocao(
                produto
            );

            expect(
                alertServiceMock.warning
            ).toHaveBeenCalled();

            expect(
                promocaoServiceMock.criar
            ).not.toHaveBeenCalled();

        }
    );

    it('deve ativar promocao com sucesso',
        () => {

            const produto = {
                id: '1',
                ativo: true
            } as any;

            component.ativarPromocao(
                produto
            );

            expect(
                promocaoServiceMock.criar
            ).toHaveBeenCalledWith({
                produtoId: '1'
            });

            expect(
                notificacaoServiceMock
                    .notificarAtualizacaoBadges
            ).toHaveBeenCalled();

            expect(
                alertServiceMock.success
            ).toHaveBeenCalled();

        }
    );

    it('deve tratar erro ao ativar promocao',
        () => {

            promocaoServiceMock.criar
                .mockReturnValue(
                    throwError(
                        () => new Error()
                    )
                );

            const produto = {
                id: '1',
                ativo: true
            } as any;

            component.ativarPromocao(
                produto
            );

            expect(
                alertServiceMock.error
            ).toHaveBeenCalled();

        }
    );

    it('deve exibir aviso quando promocao nao existir',
        () => {

            component.promocoes = [];

            component.desativarPromocao({
                id: '1'
            } as any);

            expect(
                alertServiceMock.warning
            ).toHaveBeenCalled();

            expect(
                promocaoServiceMock.encerrar
            ).not.toHaveBeenCalled();

        }
    );

    it('deve desativar promocao com sucesso',
        () => {

            component.promocoes = [
                {
                    id: '10',
                    ativa: true,
                    produto: {
                        id: '1'
                    }
                } as any
            ];

            component.desativarPromocao({
                id: '1'
            } as any);

            expect(
                promocaoServiceMock.encerrar
            ).toHaveBeenCalledWith(
                '10'
            );

            expect(
                notificacaoServiceMock
                    .notificarAtualizacaoBadges
            ).toHaveBeenCalled();

            expect(
                alertServiceMock.success
            ).toHaveBeenCalled();

        }
    );

    it('deve tratar erro ao desativar promocao',
        () => {

            promocaoServiceMock.encerrar
                .mockReturnValue(
                    throwError(
                        () => new Error()
                    )
                );

            component.promocoes = [
                {
                    id: '10',
                    ativa: true,
                    produto: {
                        id: '1'
                    }
                } as any
            ];

            component.desativarPromocao({
                id: '1'
            } as any);

            expect(
                alertServiceMock.error
            ).toHaveBeenCalled();

        }
    );

    it('deve calcular quantidade restante',
        () => {

            const promocao = {
                metaUnidades: 100,
                unidadesVendidas: 40
            } as any;

            expect(
                component.obterQuantidadeRestante(
                    promocao
                )
            ).toBe(60);

        }
    );

    it('deve calcular percentual da meta',
        () => {

            const promocao = {
                metaUnidades: 100,
                unidadesVendidas: 50
            } as any;

            expect(
                component.obterPercentualMeta(
                    promocao
                )
            ).toBe(50);

        }
    );

    it('deve retornar meta nao definida',
        () => {

            const promocao = {
                unidadesVendidas: 10
            } as any;

            expect(
                component.obterStatusMeta(
                    promocao
                )
            ).toBe(
                'Meta não definida'
            );

        }
    );

    it('deve retornar zero quando meta for indefinida',
        () => {

            const promocao = {
                unidadesVendidas: 10
            } as any;

            expect(
                component.obterPercentualMeta(
                    promocao
                )
            ).toBe(0);

        }
    );

    it('deve retornar status da meta',
        () => {

            const promocao = {
                unidadesVendidas: 40,
                metaUnidades: 100
            } as any;

            expect(
                component.obterStatusMeta(
                    promocao
                )
            ).toBe(
                '40 de 100 unidades'
            );

        }
    );

    it('deve retornar motivo padrao',
        () => {

            expect(
                component.obterMotivoPromocao(
                    '1'
                )
            ).toBe(
                'Baixo Giro'
            );

        }
    );

    it('deve retornar motivo vindo do backend',
        () => {

            component.ativas = [
                {
                    id: '1',
                    motivo: 'Estoque Parado'
                } as any
            ];

            expect(
                component.obterMotivoPromocao(
                    '1'
                )
            ).toBe(
                'Estoque Parado'
            );

        }
    );

    it('deve retornar motivo persistencia estoque parado',
        () => {

            component.ativas = [
                {
                    id: '1',
                    motivo: 'Estoque Parado'
                } as any
            ];

            expect(
                component.obterMotivoPersistencia(
                    '1'
                )
            ).toBe(
                'estoque-parado'
            );

        }
    );

    it('deve retornar motivo persistencia giro baixo',
        () => {

            expect(
                component.obterMotivoPersistencia(
                    '1'
                )
            ).toBe(
                'giro-baixo'
            );

        }
    );

    it('deve identificar produto com promocao ativa',
        () => {

            component.ativas = [
                {
                    id: '1',
                    promocaoAtiva: true
                } as any
            ];

            expect(
                component.produtoEstaComPromocaoAtiva(
                    '1'
                )
            ).toBe(true);

        }
    );

    it('deve identificar produto sem promocao ativa',
        () => {

            expect(
                component.produtoEstaComPromocaoAtiva(
                    '1'
                )
            ).toBe(false);

        }
    );

});