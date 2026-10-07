import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { Usuarios } from './usuarios';
import { UsuarioService } from '../../core/services/usuario.service';
import { TenantService } from '../../core/services/tenant.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

describe('Usuarios', () => {

    let component: Usuarios;
    let fixture: ComponentFixture<Usuarios>;
    let usuarioServiceMock: any;
    let tenantServiceMock: any;
    let authServiceMock: any;
    let alertServiceMock: any;
    let confirmDialogServiceMock: any;
    let notificacaoServiceMock: any;

    beforeEach(async () => {

        usuarioServiceMock = {

            listar: vi.fn().mockReturnValue(
                of([])
            ),

            listarPorTenant: vi.fn().mockReturnValue(
                of([])
            ),

            salvar: vi.fn().mockReturnValue(
                of({})
            ),

            atualizar: vi.fn().mockReturnValue(
                of({})
            )
        };

        beforeEach(() => {

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

        });

        tenantServiceMock = {
            listar: vi.fn().mockReturnValue(
                of([
                    {
                        id: '1',
                        nome: 'Tenant Teste'
                    }
                ])
            )
        };

        authServiceMock = {

            usuarioLogado: vi.fn().mockReturnValue({
                id: '1',
                perfil: 'SUPER_ADMIN',
                tenantId: '1'
            })

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

        confirmDialogServiceMock = {

            open: vi.fn()

        };

        notificacaoServiceMock = {

            listarBadges: vi.fn().mockReturnValue(
                of([])
            ),

            badgesAtualizados$: of(void 0),

            notificarAtualizacaoBadges: vi.fn()

        };

        await TestBed.configureTestingModule({

            imports: [
                Usuarios
            ],

            providers: [
                provideRouter([]),

                {
                    provide: UsuarioService,
                    useValue: usuarioServiceMock
                },

                {
                    provide: TenantService,
                    useValue: tenantServiceMock
                },

                {
                    provide: AuthService,
                    useValue: authServiceMock
                },

                {
                    provide: AlertService,
                    useValue: alertServiceMock
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
                Usuarios
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente',
        () => {

            expect(component)
                .toBeTruthy();

        }
    );

    it('deve carregar usuarios no ngOnInit',
        () => {

            expect(
                usuarioServiceMock.listar
            ).toHaveBeenCalled();

        }
    );

    it('deve carregar tenants no ngOnInit',
        () => {

            expect(
                tenantServiceMock.listar
            ).toHaveBeenCalled();

        }
    );

    it('deve limpar formulario no ngOnInit',
        () => {

            expect(
                component.novoNome
            ).toBe('');

            expect(
                component.novoEmail
            ).toBe('');

            expect(
                component.novoPerfil
            ).toBe('GERENTE');

        }
    );

    it('deve carregar usuarios recebidos do servico',
        () => {

            const usuarios = [
                {
                    id: '1',
                    nome: 'Usuario Teste'
                }
            ] as any;

            usuarioServiceMock.listar
                .mockReturnValue(
                    of(usuarios)
                );

            component.carregarUsuarios();

            expect(
                component.usuarios
            ).toEqual(usuarios);

        }
    );

    it('deve abrir formulario para novo usuario',
        () => {

            component.novoUsuario();

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
            component.usuarioEmEdicao = {
                id: '1'
            } as any;

            component.cancelarEdicao();

            expect(
                component.mostrarFormulario
            ).toBe(false);

            expect(
                component.modoEdicao
            ).toBe(false);

            expect(
                component.usuarioEmEdicao
            ).toBeNull();

        }
    );

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

    it('deve editar usuario',
        () => {

            const usuario = {
                id: '1',
                nome: 'Maria',
                email: 'maria@teste.com',
                perfil: 'GERENTE',
                ativo: true
            } as any;

            component.editarUsuario(
                usuario
            );

            expect(
                component.usuarioEmEdicao
            ).toEqual(usuario);

            expect(
                component.novoNome
            ).toBe('Maria');

            expect(
                component.modoEdicao
            ).toBe(true);

        }
    );

    it('deve visualizar usuario',
        () => {

            const usuario = {
                id: '1',
                nome: 'Maria',
                email: 'maria@teste.com',
                perfil: 'GERENTE',
                ativo: true
            } as any;

            component.visualizarUsuario(
                usuario
            );

            expect(
                component.usuarioEmEdicao
            ).toEqual(usuario);

            expect(
                component.modoVisualizacao
            ).toBe(true);

        }
    );

    it('deve retornar usuariosTabela',
        () => {

            component.usuarios = [
                {
                    nome: 'Maria',
                    ativo: true
                } as any
            ];

            expect(
                component.usuariosTabela
            ).toHaveLength(1);

        }
    );

    it('deve retornar status ativo',
        () => {

            component.usuarios = [
                {
                    nome: 'Maria',
                    ativo: true
                } as any
            ];

            expect(
                (component.usuariosTabela[0] as any)
                    .status
            ).toBe('Ativo');

        }
    );

    it('deve retornar status inativo',
        () => {

            component.usuarios = [
                {
                    nome: 'Maria',
                    ativo: false
                } as any
            ];

            expect(
                (component.usuariosTabela[0] as any)
                    .status
            ).toBe('Inativo');

        }
    );

    it('deve filtrar usuarios',
        () => {

            component.usuarios = [
                {
                    nome: 'Maria'
                } as any,
                {
                    nome: 'Joao'
                } as any
            ];

            component.textoBusca = 'Maria';

            expect(
                component.usuariosFiltrados
            ).toHaveLength(1);

        }
    );

    it('deve filtrar ignorando maiusculas e minusculas',
        () => {

            component.usuarios = [
                {
                    nome: 'Maria'
                } as any
            ];

            component.textoBusca = 'MARIA';

            expect(
                component.usuariosFiltrados
            ).toHaveLength(1);

        }
    );

    it('deve retornar todos os usuarios sem filtro',
        () => {

            component.usuarios = [
                {} as any,
                {} as any
            ];

            component.textoBusca = '';

            expect(
                component.usuariosFiltrados
            ).toHaveLength(2);

        }
    );

    it('deve retornar nome do tenant',
        () => {

            component.tenants = [
                {
                    id: '1',
                    nome: 'Adega Central'
                } as any
            ];

            expect(
                component.obterNomeTenant(
                    '1'
                )
            ).toBe(
                'Adega Central'
            );

        }
    );

    it('deve retornar vazio quando tenant nao existir',
        () => {

            expect(
                component.obterNomeTenant(
                    '999'
                )
            ).toBe('');

        }
    );

    it('deve retornar vazio quando tenantId nao for informado',
        () => {

            expect(
                component.obterNomeTenant()
            ).toBe('');

        }
    );

    it('deve retornar true para super admin',
        () => {

            authServiceMock.usuarioLogado
                .mockReturnValue({
                    perfil: 'SUPER_ADMIN'
                });

            expect(
                component.ehSuperAdmin
            ).toBe(true);

        }
    );

    it('deve retornar false para usuario comum',
        () => {

            authServiceMock.usuarioLogado
                .mockReturnValue({
                    perfil: 'GERENTE'
                });

            expect(
                component.ehSuperAdmin
            ).toBe(false);

        }
    );

    it('deve retornar perfis para super admin',
        () => {

            authServiceMock.usuarioLogado
                .mockReturnValue({
                    perfil: 'SUPER_ADMIN'
                });

            expect(
                component.perfisDisponiveis
            ).toEqual([
                'PROPRIETARIO',
                'SOCIO',
                'GERENTE',
                'OPERADOR_CAIXA',
                'ESTOQUISTA'
            ]);

        }
    );

    it('deve retornar perfis para proprietario',
        () => {

            authServiceMock.usuarioLogado
                .mockReturnValue({
                    perfil: 'PROPRIETARIO'
                });

            expect(
                component.perfisDisponiveis
            ).toEqual([
                'SOCIO',
                'GERENTE',
                'OPERADOR_CAIXA',
                'ESTOQUISTA'
            ]);

        }
    );

    it('deve retornar perfis para socio',
        () => {

            authServiceMock.usuarioLogado
                .mockReturnValue({
                    perfil: 'SOCIO'
                });

            expect(
                component.perfisDisponiveis
            ).toEqual([
                'GERENTE',
                'OPERADOR_CAIXA',
                'ESTOQUISTA'
            ]);

        }
    );

    it('deve retornar perfis para gerente',
        () => {

            authServiceMock.usuarioLogado
                .mockReturnValue({
                    perfil: 'GERENTE'
                });

            expect(
                component.perfisDisponiveis
            ).toEqual([
                'OPERADOR_CAIXA',
                'ESTOQUISTA'
            ]);

        }
    );

    it('deve retornar lista vazia para perfil desconhecido',
        () => {

            authServiceMock.usuarioLogado
                .mockReturnValue({
                    perfil: 'OPERADOR_CAIXA'
                });

            expect(
                component.perfisDisponiveis
            ).toEqual([]);

        }
    );

    it('deve carregar usuarios por tenant',
        () => {

            const usuarios = [
                {
                    id: '1'
                }
            ] as any;

            usuarioServiceMock
                .listarPorTenant
                .mockReturnValue(
                    of(usuarios)
                );

            component.filtrarPorTenant(
                '1'
            );

            expect(
                usuarioServiceMock
                    .listarPorTenant
            ).toHaveBeenCalledWith(
                '1'
            );

            expect(
                component.usuarios
            ).toEqual(
                usuarios
            );

        }
    );

    it('deve recarregar usuarios quando tenant for vazio',
        () => {

            const carregarSpy =
                vi.spyOn(
                    component,
                    'carregarUsuarios'
                );

            component.filtrarPorTenant(
                ''
            );

            expect(
                carregarSpy
            ).toHaveBeenCalled();

        }
    );

    it('deve exigir tenant',
        () => {

            component.tenants = [];

            component.tenantCadastroId = '';

            component.novoNome = 'Maria';
            component.novoEmail = 'maria@teste.com';
            component.novaSenha = '123456';

            component.salvarUsuario();

            expect(
                alertServiceMock.error
            ).toHaveBeenCalled();

        }
    );

    it('deve exigir nome',
        () => {

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

            component.tenantCadastroId = '1';

            component.novoNome = '';

            component.novoEmail = 'maria@teste.com';
            component.novaSenha = '123456';

            component.salvarUsuario();

            expect(
                alertServiceMock.error
            ).toHaveBeenCalled();

        }
    );

    it('deve exigir email',
        () => {

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = '';

            component.novaSenha = '123456';

            component.salvarUsuario();

            expect(
                alertServiceMock.error
            ).toHaveBeenCalled();

        }
    );

    it('deve exigir senha ao criar usuario',
        () => {

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            component.novaSenha = '';

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

            component.salvarUsuario();

            expect(
                alertServiceMock.error
            ).toHaveBeenCalled();

        }
    );

    it('deve criar usuario com sucesso',
        () => {

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            component.novaSenha = '123456';

            usuarioServiceMock.salvar
                .mockReturnValue(
                    of({})
                );

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

            component.salvarUsuario();

            expect(
                usuarioServiceMock.salvar
            ).toHaveBeenCalled();

            expect(
                alertServiceMock.updateToast
            ).toHaveBeenCalled();

        }
    );

    it('deve limpar formulario apos criar usuario',
        () => {

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            component.novaSenha = '123456';

            usuarioServiceMock.salvar
                .mockReturnValue(
                    of({})
                );

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

            component.salvarUsuario();

            expect(
                component.novoNome
            ).toBe('');

            expect(
                component.novoEmail
            ).toBe('');

        }
    );

    it('deve tratar erro ao criar usuario',
        () => {

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            component.novaSenha = '123456';

            usuarioServiceMock.salvar
                .mockReturnValue(
                    throwError(
                        () => new Error()
                    )
                );

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

            component.salvarUsuario();

            expect(
                alertServiceMock.updateToast
            ).toHaveBeenCalled();

        }
    );

    it('deve atualizar usuario com sucesso',
        () => {

            component.tenants = [
                {
                    id: '1',
                    nome: 'Tenant Teste'
                } as any
            ];

            component.usuarioEmEdicao = {
                id: '1'
            } as any;

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            component.novaSenha = '123456';

            usuarioServiceMock.atualizar
                .mockReturnValue(
                    of({})
                );

            component.salvarUsuario();

            expect(
                usuarioServiceMock.atualizar
            ).toHaveBeenCalled();

        }
    );

    it('deve recarregar usuarios apos atualizar',
        () => {

            const carregarSpy =
                vi.spyOn(
                    component,
                    'carregarUsuarios'
                );

            component.tenants = [
                {
                    id: '1'
                } as any
            ];

            component.usuarioEmEdicao = {
                id: '1'
            } as any;

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            usuarioServiceMock.atualizar
                .mockReturnValue(
                    of({})
                );

            component.salvarUsuario();

            expect(
                carregarSpy
            ).toHaveBeenCalled();

        }
    );

    it('deve limpar formulario apos atualizar',
        () => {

            component.tenants = [
                {
                    id: '1'
                } as any
            ];

            component.usuarioEmEdicao = {
                id: '1'
            } as any;

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            usuarioServiceMock.atualizar
                .mockReturnValue(
                    of({})
                );

            component.salvarUsuario();

            expect(
                component.novoNome
            ).toBe('');

            expect(
                component.novoEmail
            ).toBe('');

        }
    );

    it('deve tratar erro ao atualizar usuario',
        () => {

            component.tenants = [
                {
                    id: '1'
                } as any
            ];

            component.usuarioEmEdicao = {
                id: '1'
            } as any;

            component.tenantCadastroId = '1';

            component.novoNome = 'Maria';

            component.novoEmail = 'maria@teste.com';

            usuarioServiceMock.atualizar
                .mockReturnValue(
                    throwError(
                        () => new Error()
                    )
                );

            component.salvarUsuario();

            expect(
                alertServiceMock.updateToast
            ).toHaveBeenCalled();

        }
    );

    it('nao deve alterar usuario sem id',
        () => {

            component.alternarStatusUsuario({
                nome: 'Maria'
            } as any);

            expect(
                confirmDialogServiceMock.open
            ).not.toHaveBeenCalled();

        }
    );

    it('deve abrir dialog para desativar usuario',
        () => {

            component.alternarStatusUsuario(
                {
                    id: '1',
                    nome: 'Maria',
                    ativo: true
                } as any
            );

            expect(
                confirmDialogServiceMock.open
            ).toHaveBeenCalled();

        }
    );

    it('deve abrir dialog para ativar usuario',
        () => {

            component.alternarStatusUsuario(
                {
                    id: '1',
                    nome: 'Maria',
                    ativo: false
                } as any
            );

            expect(
                confirmDialogServiceMock.open
            ).toHaveBeenCalled();

        }
    );

    it('deve atualizar usuario ao confirmar',
        () => {

            let config: any;

            confirmDialogServiceMock.open
                .mockImplementation(
                    (c: any) => config = c
                );

            usuarioServiceMock.atualizar
                .mockReturnValue(
                    of({})
                );

            component.alternarStatusUsuario(
                {
                    id: '1',
                    nome: 'Maria',
                    email: 'maria@teste.com',
                    perfil: 'GERENTE',
                    ativo: true,
                    tenantId: '1'
                } as any
            );

            config.onConfirm();

            expect(
                usuarioServiceMock.atualizar
            ).toHaveBeenCalled();

        }
    );

    it('deve recarregar usuarios apos alterar status',
        () => {

            const carregarSpy =
                vi.spyOn(
                    component,
                    'carregarUsuarios'
                );

            let config: any;

            confirmDialogServiceMock.open
                .mockImplementation(
                    (c: any) => config = c
                );

            usuarioServiceMock.atualizar
                .mockReturnValue(
                    of({})
                );

            component.alternarStatusUsuario(
                {
                    id: '1',
                    nome: 'Maria',
                    email: 'maria@teste.com',
                    perfil: 'GERENTE',
                    ativo: true,
                    tenantId: '1'
                } as any
            );

            config.onConfirm();

            expect(
                carregarSpy
            ).toHaveBeenCalled();

        }
    );

    it('deve tratar erro ao alterar status',
        () => {

            let config: any;

            confirmDialogServiceMock.open
                .mockImplementation(
                    (c: any) => config = c
                );

            usuarioServiceMock.atualizar
                .mockReturnValue(
                    throwError(
                        () => new Error()
                    )
                );

            component.alternarStatusUsuario(
                {
                    id: '1',
                    nome: 'Maria',
                    email: 'maria@teste.com',
                    perfil: 'GERENTE',
                    ativo: true,
                    tenantId: '1'
                } as any
            );

            config.onConfirm();

            expect(
                alertServiceMock.updateToast
            ).toHaveBeenCalled();

        }
    );

});