import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Header } from './header';

import { AuthService } from '../../../core/services/auth.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { AlertService } from '../../../core/services/alert.service';
import { Router } from '@angular/router';

describe('Header', () => {

    let component: Header;
    let fixture: ComponentFixture<Header>;

    let authServiceMock: any;
    let tenantContextServiceMock: any;
    let alertServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {

        authServiceMock = {

            usuarioLogado: vi.fn(),

            logout: vi.fn(),

            alterarSenha: vi.fn()

        };

        tenantContextServiceMock = {

            tenantAtual: {
                slug: 'adega'
            }

        };

        alertServiceMock = {

            loading: vi.fn()
                .mockReturnValue({
                    id: 'toast-id'
                }),

            updateToast: vi.fn()

        };

        routerMock = {

            navigate: vi.fn()

        };

        await TestBed.configureTestingModule({

            imports: [
                Header
            ],

            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceMock
                },
                {
                    provide: TenantContextService,
                    useValue: tenantContextServiceMock
                },
                {
                    provide: AlertService,
                    useValue: alertServiceMock
                },
                {
                    provide: Router,
                    useValue: routerMock
                }
            ]

        }).compileComponents();

        fixture =
            TestBed.createComponent(
                Header
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve retornar tenant atual', () => {

        expect(
            component.tenantAtual
        ).toEqual(
            tenantContextServiceMock.tenantAtual
        );

    });

    it('deve emitir evento ao alternar menu', () => {

        const emitSpy =
            vi.spyOn(
                component.toggleMenu,
                'emit'
            );

        component.alternarMenu();

        expect(
            emitSpy
        ).toHaveBeenCalled();

    });

    it('deve realizar logout', () => {

        component.sair();

        expect(
            authServiceMock.logout
        ).toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).toHaveBeenCalledWith([
            '/login'
        ]);

    });

    it('deve retornar usuario logado', () => {

        const usuario = {

            nome: 'Joao Silva'

        };

        authServiceMock
            .usuarioLogado
            .mockReturnValue(
                usuario
            );

        expect(
            component.usuarioLogado
        ).toEqual(
            usuario
        );

    });

    it('deve retornar primeiro nome', () => {

        authServiceMock
            .usuarioLogado
            .mockReturnValue({
                nome: 'Joao Silva'
            });

        expect(
            component.primeiroNome
        ).toBe('Joao');

    });

    it('deve retornar vazio quando nao houver usuario', () => {

        authServiceMock
            .usuarioLogado
            .mockReturnValue(
                null
            );

        expect(
            component.primeiroNome
        ).toBe('');

    });

    it('deve abrir menu de perfil', () => {

        component.menuPerfilAberto = false;

        component.alternarMenuPerfil();

        expect(
            component.menuPerfilAberto
        ).toBe(true);

    });

    it('deve fechar menu de perfil', () => {

        component.menuPerfilAberto = true;

        component.alternarMenuPerfil();

        expect(
            component.menuPerfilAberto
        ).toBe(false);

    });

    it('deve abrir modal alterar senha', () => {

        component.menuPerfilAberto = true;

        component.abrirModalAlterarSenha();

        expect(
            component.modalAlterarSenhaAberto
        ).toBe(true);

        expect(
            component.menuPerfilAberto
        ).toBe(false);

    });

    it('deve fechar modal alterar senha', () => {

        component.modalAlterarSenhaAberto = true;

        component.fecharModalAlterarSenha();

        expect(
            component.modalAlterarSenhaAberto
        ).toBe(false);

    });

    it('deve fechar modal ao pressionar ESC', () => {

        component.modalAlterarSenhaAberto = true;

        component.onEscape();

        expect(
            component.modalAlterarSenhaAberto
        ).toBe(false);

    });

    it('nao deve salvar senha com formulario invalido', () => {

        component.salvarSenha();

        expect(
            authServiceMock.alterarSenha
        ).not.toHaveBeenCalled();

    });

    it('deve alterar senha com sucesso', () => {

        authServiceMock
            .alterarSenha
            .mockReturnValue(
                of({})
            );

        component.formAlterarSenha.patchValue({

            senhaAtual: '123',

            novaSenha: '456',

            confirmarSenha: '456'

        });

        component.salvarSenha();

        expect(
            authServiceMock.alterarSenha
        ).toHaveBeenCalled();

        expect(
            authServiceMock.logout
        ).toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).toHaveBeenCalledWith([
            '/adega/login'
        ]);

    });

    it('deve tratar erro ao alterar senha', () => {

        authServiceMock
            .alterarSenha
            .mockReturnValue(
                throwError(
                    () => ({
                        error: {
                            message:
                                'Erro teste'
                        }
                    })
                )
            );

        component.formAlterarSenha.patchValue({

            senhaAtual: '123',

            novaSenha: '456',

            confirmarSenha: '456'

        });

        component.salvarSenha();

        expect(
            alertServiceMock
                .updateToast
        ).toHaveBeenCalled();

        expect(
            component.salvandoSenha
        ).toBe(false);

    });

    it('deve identificar super admin', () => {

        authServiceMock
            .usuarioLogado
            .mockReturnValue({
                perfil:
                    'SUPER_ADMIN'
            });

        expect(
            component.ehSuperAdmin
        ).toBe(true);

    });

    it('deve identificar usuario comum', () => {

        authServiceMock
            .usuarioLogado
            .mockReturnValue({
                perfil:
                    'OPERADOR_CAIXA'
            });

        expect(
            component.ehSuperAdmin
        ).toBe(false);

    });

});