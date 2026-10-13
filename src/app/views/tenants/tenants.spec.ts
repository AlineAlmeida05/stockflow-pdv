import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Tenants } from './tenants';
import { TenantService } from '../../core/services/tenant.service';
import { AlertService } from '../../core/services/alert.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { Tenant } from '../../core/models/tenant.model';


function criarTenant(
    overrides: Partial<Tenant> = {}
): Tenant {
    return {
        id: '1',
        nome: 'Adega Central',
        slug: 'adega-central',
        codigoTenant: 'ADC',
        ativo: true,
        responsavel: 'João',
        email: 'joao@email.com',
        cidade: 'São Paulo',
        logoUrl: '',
        faviconUrl: '',
        corPrimaria: '',
        corSecundaria: '',
        ...overrides
    };
}

function preencherFormulario(
    component: Tenants
): void {
    component.novoNome = 'Adega Teste';
    component.novoSlug = 'adega-teste';
    component.novoCodigoTenant = 'ADT';
    component.novoResponsavel = 'João';
    component.novoEmail = 'joao@email.com';
    component.novaCidade = 'São Paulo';
}

describe('Tenants', () => {

    beforeAll(() => {
        vi.spyOn(
            console,
            'error'
        ).mockImplementation(
            () => { }
        );
    });

    let component: Tenants;
    let fixture: ComponentFixture<Tenants>;

    let tenantServiceMock: {
        listar: ReturnType<typeof vi.fn>;
        salvar: ReturnType<typeof vi.fn>;
        atualizar: ReturnType<typeof vi.fn>;
    };

    let alertServiceMock: {
        warning: ReturnType<typeof vi.fn>;
        success: ReturnType<typeof vi.fn>;
        error: ReturnType<typeof vi.fn>;
        loading: ReturnType<typeof vi.fn>;
        updateToast: ReturnType<typeof vi.fn>;
    };

    let tenantContextServiceMock: {
        tenantAtual: any;
    };

    let confirmDialogServiceMock: {
        open: ReturnType<typeof vi.fn>;
    };

    let notificacaoServiceMock = {

        listarBadges: vi.fn().mockReturnValue(
            of([])
        ),

        badgesAtualizados$: of(void 0),

        notificarAtualizacaoBadges: vi.fn()

    };

    beforeEach(async () => {

        tenantServiceMock = {

            listar: vi
                .fn()
                .mockReturnValue(
                    of([])
                ),

            salvar: vi
                .fn()
                .mockReturnValue(
                    of({})
                ),

            atualizar: vi
                .fn()
                .mockReturnValue(
                    of({})
                )
        };

        alertServiceMock = {

            warning: vi.fn(),

            success: vi.fn(),

            error: vi.fn(),

            loading: vi.fn().mockReturnValue({
                id: 'toast-id'
            }),

            updateToast: vi.fn()

        };

        tenantContextServiceMock = {

            tenantAtual: null

        };

        confirmDialogServiceMock = {

            open: vi.fn()

        };

        await TestBed.configureTestingModule({

            imports: [
                Tenants
            ],

            providers: [
                {
                    provide: TenantService,
                    useValue: tenantServiceMock
                },
                {
                    provide: AlertService,
                    useValue: alertServiceMock
                },
                {
                    provide: TenantContextService,
                    useValue: tenantContextServiceMock
                },
                {
                    provide: ConfirmDialogService,
                    useValue: confirmDialogServiceMock
                },
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                }
            ]

        }).compileComponents();

        fixture =
            TestBed.createComponent(
                Tenants
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    describe('component', () => {

        it('deve criar o componente',
            () => {

                expect(component).toBeTruthy();

            }
        );
    });

    describe('ngOnInit', () => {

        it('deve carregar tenants no ngOnInit',
            () => {

                expect(
                    tenantServiceMock.listar
                ).toHaveBeenCalled();

            }
        );

        it('deve carregar tenants recebidos do servico',
            () => {

                const tenants = [
                    {
                        id: '1',
                        nome: 'Adega Teste'
                    }
                ] as any;

                tenantServiceMock.listar
                    .mockReturnValue(
                        of(tenants)
                    );

                component.carregarTenants();

                expect(
                    component.tenants
                ).toEqual(tenants);

            }
        );
    });

    describe('gerarSlug', () => {

        it('deve gerar slug',
            () => {

                component.novoNome = 'Adega São João';


                component.gerarSlug();

                expect(
                    component.novoSlug
                ).toBe(
                    'adega-sao-joao'
                );

            }
        );

        it('nao deve gerar slug em modo edicao',
            () => {

                component.modoEdicao = true;

                component.novoNome = 'Adega Teste';

                component.gerarSlug();

                expect(
                    component.novoSlug
                ).toBe('');

            }
        );

        it('deve remover acentos do slug',
            () => {

                component.novoNome = 'São José';

                component.gerarSlug();

                expect(
                    component.novoSlug
                ).toBe('sao-jose');

            }
        );
    });

    describe('gerarCodigoTenant', () => {

        it('deve gerar codigo tenant com duas palavras',
            () => {

                component.novoNome = 'Adega Central';

                component.gerarCodigoTenant();

                expect(
                    component.novoCodigoTenant
                ).toBe('ACE');

            }
        );

        it('deve gerar codigo tenant com uma palavra',
            () => {

                component.novoNome = 'Adega';

                component.gerarCodigoTenant();

                expect(
                    component.novoCodigoTenant
                ).toBe('ADE');

            }
        );

        it('nao deve gerar codigo em modo edicao',
            () => {

                component.modoEdicao = true;

                component.novoNome = 'Adega Central';

                component.gerarCodigoTenant();

                expect(
                    component.novoCodigoTenant
                ).toBe('');

            }
        );

        it('deve gerar codigo ignorando espacos extras',
            () => {

                component.novoNome = '  Adega   Central  ';

                component.gerarCodigoTenant();

                expect(
                    component.novoCodigoTenant
                ).toBe('ACE');

            }
        );
    });

    describe('salvarTenant', () => {

        it('nao deve salvar tenant sem nome',
            () => {

                component.novoNome = '';

                component.salvarTenant();

                expect(
                    alertServiceMock.warning
                ).toHaveBeenCalled();

                expect(
                    tenantServiceMock.salvar
                ).not.toHaveBeenCalled();

            }
        );

        it('deve salvar tenant com sucesso',
            () => {

                const tenantCriado = {
                    id: '1',
                    nome: 'Adega Teste'
                };

                tenantServiceMock.salvar
                    .mockReturnValue(
                        of(tenantCriado)
                    );

                preencherFormulario(
                    component
                );

                component.salvarTenant();

                expect(
                    tenantServiceMock.salvar
                ).toHaveBeenCalled();

                expect(
                    component.tenants
                ).toContainEqual(
                    tenantCriado
                );

                expect(
                    alertServiceMock.updateToast
                ).toHaveBeenCalled();

            }
        );

        it('deve limpar formulario ao salvar tenant',
            () => {

                tenantServiceMock.salvar
                    .mockReturnValue(
                        of({
                            id: '1'
                        })
                    );

                preencherFormulario(
                    component
                );

                component.salvarTenant();

                expect(
                    component.novoNome
                ).toBe('');

                expect(
                    component.novoSlug
                ).toBe('');

            }
        );

        it('deve tratar erro ao salvar tenant', () => {

            tenantServiceMock.salvar
                .mockReturnValue(
                    throwError(() => new Error())
                );

            preencherFormulario(
                component
            );

            component.salvarTenant();

            expect(
                alertServiceMock.updateToast
            ).toHaveBeenCalled();

        });
    });

    describe('atualizarTenant', () => {

        it('nao deve atualizar sem tenant selecionado',
            () => {

                component.tenantEditando = null;

                component.atualizarTenant();

                expect(
                    tenantServiceMock.atualizar
                ).not.toHaveBeenCalled();

            }
        );

        it('deve atualizar tenant com sucesso',
            () => {

                const tenantAtualizado = {
                    id: '1',
                    nome: 'Novo Nome'
                } as any;

                component.tenants = [
                    {
                        id: '1',
                        nome: 'Antigo'
                    } as any
                ];

                component.tenantEditando = {
                    id: '1'
                } as any;

                tenantServiceMock.atualizar
                    .mockReturnValue(
                        of(tenantAtualizado)
                    );

                component.atualizarTenant();

                expect(
                    tenantServiceMock.atualizar
                ).toHaveBeenCalled();

                expect(
                    component.tenants[0]
                ).toEqual(
                    tenantAtualizado
                );

            }
        );

        it('deve limpar modo edicao ao atualizar',
            () => {

                component.tenants = [
                    {
                        id: '1'
                    } as any
                ];

                component.tenantEditando = {
                    id: '1'
                } as any;

                tenantServiceMock.atualizar
                    .mockReturnValue(
                        of({
                            id: '1'
                        })
                    );

                component.modoEdicao = true;

                component.atualizarTenant();

                expect(
                    component.modoEdicao
                ).toBe(false);

                expect(
                    component.tenantEditando
                ).toBeNull();

            }
        );

        it('deve limpar formulario ao atualizar',
            () => {

                component.tenants = [
                    {
                        id: '1'
                    } as any
                ];

                component.tenantEditando = {
                    id: '1'
                } as any;

                preencherFormulario(
                    component
                );

                tenantServiceMock.atualizar
                    .mockReturnValue(
                        of({
                            id: '1'
                        })
                    );

                component.atualizarTenant();

                expect(
                    component.novoNome
                ).toBe('');

                expect(
                    component.novoSlug
                ).toBe('');

            }
        );

        it('deve tratar erro ao atualizar tenant',
            () => {

                component.tenantEditando = {
                    id: '1'
                } as any;

                tenantServiceMock.atualizar
                    .mockReturnValue(
                        throwError(
                            () => new Error()
                        )
                    );

                component.atualizarTenant();

                expect(
                    alertServiceMock.updateToast
                ).toHaveBeenCalled();

            }
        );
    });

    describe('alternarStatusTenant', () => {

        it('deve abrir dialog para desativar tenant',
            () => {

                const tenant = criarTenant({
                    ativo: true
                });

                component.alternarStatusTenant(
                    tenant
                );

                expect(
                    confirmDialogServiceMock.open
                ).toHaveBeenCalled();

            }
        );

        it('deve abrir dialog para ativar tenant',
            () => {

                const tenant = criarTenant({
                    ativo: false
                });

                component.alternarStatusTenant(
                    tenant
                );

                expect(
                    confirmDialogServiceMock.open
                ).toHaveBeenCalled();

            }
        );

        it('deve atualizar tenant ao confirmar',
            () => {

                const tenant = criarTenant({
                    nome: 'Adega'
                });

                let config: any;

                confirmDialogServiceMock.open
                    .mockImplementation(
                        c => config = c
                    );

                component.alternarStatusTenant(
                    tenant
                );

                config.onConfirm();

                expect(
                    tenantServiceMock.atualizar
                ).toHaveBeenCalled();

            }
        );

        it('deve recarregar tenants apos atualizar status',
            () => {

                const carregarSpy =
                    vi.spyOn(
                        component,
                        'carregarTenants'
                    );

                let config: any;

                confirmDialogServiceMock.open
                    .mockImplementation(
                        c => config = c
                    );

                tenantServiceMock.atualizar
                    .mockReturnValue(
                        of({})
                    );

                component.alternarStatusTenant({
                    id: '1',
                    ativo: true
                } as any);

                config.onConfirm();

                expect(
                    carregarSpy
                ).toHaveBeenCalled();

            }
        );

        it('deve exibir sucesso ao atualizar status',
            () => {

                let config: any;

                confirmDialogServiceMock.open
                    .mockImplementation(
                        c => config = c
                    );

                tenantServiceMock.atualizar
                    .mockReturnValue(
                        of({})
                    );

                component.alternarStatusTenant({
                    id: '1',
                    ativo: true
                } as any);

                config.onConfirm();

                expect(
                    alertServiceMock.updateToast
                ).toHaveBeenCalled();

            }
        );

        it('deve tratar erro ao atualizar status',
            () => {

                let config: any;

                confirmDialogServiceMock.open
                    .mockImplementation(
                        c => config = c
                    );

                tenantServiceMock.atualizar
                    .mockReturnValue(
                        throwError(
                            () => new Error()
                        )
                    );

                component.alternarStatusTenant({
                    id: '1',
                    ativo: true
                } as any);

                config.onConfirm();

                expect(
                    alertServiceMock.updateToast
                ).toHaveBeenCalled();

            }
        );
    });

    describe('getters', () => {

        it('deve retornar tenantAtual',
            () => {

                const tenant = {
                    id: '1'
                };

                tenantContextServiceMock
                    .tenantAtual = tenant;

                expect(
                    component.tenantAtual
                ).toEqual(tenant);

            }
        );

        it('deve retornar tenantsTabela',
            () => {

                component.tenants = [
                    {
                        nome: 'Adega',
                        ativo: true
                    } as any
                ];

                expect(
                    component.tenantsTabela
                ).toHaveLength(1);

            }
        );

        it('deve retornar status ativo',
            () => {

                component.tenants = [
                    {
                        nome: 'Adega',
                        ativo: true
                    } as any
                ];

                expect(
                    (component.tenantsTabela[0] as any)
                        .status
                ).toBe('Ativo');

            }
        );

        it('deve retornar status inativo',
            () => {

                component.tenants = [
                    {
                        nome: 'Adega',
                        ativo: false
                    } as any
                ];

                expect(
                    (component.tenantsTabela[0] as any)
                        .status
                ).toBe('Inativo');

            }
        );

        it('deve filtrar tenants',
            () => {

                component.tenants = [
                    {
                        nome: 'Adega Central',
                        ativo: true
                    } as any,
                    {
                        nome: 'Mercado Azul',
                        ativo: true
                    } as any
                ];

                component.textoBusca = 'Adega';

                expect(
                    component.tenantsFiltrados
                ).toHaveLength(1);

            }
        );

        it('deve retornar todos os tenants sem filtro',
            () => {

                component.tenants = [
                    {} as any,
                    {} as any
                ];

                component.textoBusca = '';

                expect(
                    component.tenantsFiltrados
                ).toHaveLength(2);

            }
        );

        it('deve filtrar ignorando maiusculas e minusculas',
            () => {

                component.tenants = [
                    {
                        nome: 'Adega Central',
                        ativo: true
                    } as any
                ];

                component.textoBusca = 'ADEGA';

                expect(
                    component.tenantsFiltrados
                ).toHaveLength(1);

            }
        );
    });

    describe('formulario', () => {

        it('deve abrir formulario para novo tenant',
            () => {

                component.novoTenant();

                expect(
                    component.mostrarFormulario
                ).toBe(true);

                expect(
                    component.modoEdicao
                ).toBe(false);

            }
        );

        it('deve cancelar edicao',
            () => {

                component.mostrarFormulario = true;
                component.modoEdicao = true;

                preencherFormulario(
                    component
                );

                component.cancelarEdicao();

                expect(
                    component.mostrarFormulario
                ).toBe(false);

                expect(
                    component.modoEdicao
                ).toBe(false);

                expect(
                    component.novoNome
                ).toBe('');

            }
        );
    });

    describe('visualizarTenant', () => {

        it('deve visualizar tenant',
            () => {

                const tenant = criarTenant({
                    nome: 'Adega Teste',
                    slug: 'adega-teste',
                    codigoTenant: 'ADT'
                });

                component.visualizarTenant(
                    tenant
                );

                expect(
                    component.tenantEditando
                ).toEqual(tenant);

                expect(
                    component.mostrarFormulario
                ).toBe(true);

                expect(
                    component.modoVisualizacao
                ).toBe(true);

            }
        );

        it('deve preencher campos ao visualizar tenant',
            () => {

                const tenant = criarTenant({
                    nome: 'Adega Teste',
                    slug: 'adega-teste',
                    codigoTenant: 'ADT',
                    cidade: 'Franco da Rocha',
                    ativo: false
                });

                component.visualizarTenant(
                    tenant
                );

                expect(component.novoNome)
                    .toBe('Adega Teste');

                expect(component.novoSlug)
                    .toBe('adega-teste');

                expect(component.novoCodigoTenant)
                    .toBe('ADT');

            }
        );
    });

    describe('habilitarEdicao', () => {

        it('deve habilitar edicao',
            () => {

                component.modoVisualizacao = true;

                component.habilitarEdicao();

                expect(
                    component.modoVisualizacao
                ).toBe(false);

                expect(
                    component.modoEdicao
                ).toBe(true);

            }
        );
    });

    describe('gerarUrlTenant', () => {

        it('deve gerar url tenant',
            () => {

                const tenant = {
                    slug: 'adega-central'
                } as any;

                expect(
                    component.gerarUrlTenant(
                        tenant
                    )
                ).toBe(
                    '/adega-central'
                );

            }
        );
    });
});