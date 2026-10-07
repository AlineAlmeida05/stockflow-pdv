import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { TenantService } from '../../../core/services/tenant.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

describe('LoginComponent', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    let authServiceMock: any;
    let alertServiceMock: any;
    let tenantServiceMock: any;
    let tenantContextServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {

        authServiceMock = {
            login: vi.fn(),
            rotaInicial: vi.fn()
                .mockReturnValue('/dashboard')
        };

        alertServiceMock = {
            loading: vi.fn()
                .mockReturnValue({
                    id: 'toast-id'
                }),
            updateToast: vi.fn()
        };

        tenantServiceMock = {
            buscarPorSlug: vi.fn()
                .mockReturnValue(of(null))
        };

        tenantContextServiceMock = {
            setTenant: vi.fn()
        };

        routerMock = {
            navigate: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [
                LoginComponent
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceMock
                },
                {
                    provide: AlertService,
                    useValue: alertServiceMock
                },
                {
                    provide: TenantService,
                    useValue: tenantServiceMock
                },
                {
                    provide: TenantContextService,
                    useValue: tenantContextServiceMock
                },
                {
                    provide: Router,
                    useValue: routerMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: vi.fn()
                                    .mockReturnValue('adega')
                            }
                        },
                        paramMap: of({})
                    }
                }
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                LoginComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve carregar tenant no ngOnInit', () => {

        expect(
            tenantServiceMock
                .buscarPorSlug
        ).toHaveBeenCalled();

    });

    it('deve marcar tenantNaoEncontrado quando tenant for nulo', () => {

        tenantServiceMock.buscarPorSlug
            .mockReturnValue(
                of(null)
            );

        component.ngOnInit();

        expect(
            component.tenantNaoEncontrado
        ).toBe(true);

    });

    it('deve carregar tenant com sucesso', () => {

        const tenant = {
            nome: 'Adega Teste'
        };

        tenantServiceMock.buscarPorSlug
            .mockReturnValue(
                of(tenant)
            );

        component.ngOnInit();

        expect(
            component.tenant
        ).toEqual(tenant);

    });

    it('deve tratar erro 404', () => {

        tenantServiceMock.buscarPorSlug
            .mockReturnValue(
                throwError(
                    () => ({
                        status: 404
                    })
                )
            );

        component.ngOnInit();

        expect(
            component.tenantNaoEncontrado
        ).toBe(true);

    });

    it('deve alternar exibicao da senha', () => {

        expect(
            component.mostrarSenha
        ).toBe(false);

        component.alternarSenha();

        expect(
            component.mostrarSenha
        ).toBe(true);

    });

    it('deve retornar slogan padrao', () => {

        component.tenant = null;

        expect(
            component.sloganExibicao
        ).toBe(
            component.slogan
        );

    });

    it('deve retornar slogan do tenant', () => {

        component.tenant = {
            slogan: 'Slogan teste'
        };

        expect(
            component.sloganExibicao
        ).toBe('Slogan teste');

    });

    it('deve navegar para login padrao ao voltar', () => {

        component.voltar();

        expect(
            routerMock.navigate
        ).toHaveBeenCalledWith([
            '/stockflowpdv/login'
        ]);

    });

    it('nao deve submeter formulario invalido', () => {

        component.submit();

        expect(
            authServiceMock.login
        ).not.toHaveBeenCalled();

    });

    it('deve realizar login com sucesso', () => {

        authServiceMock.login
            .mockReturnValue(
                of({})
            );

        component.form.patchValue({
            email: 'teste@email.com',
            senha: '123456'
        });

        component.submit();

        expect(
            authServiceMock.login
        ).toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).toHaveBeenCalled();

    });

    it('deve tratar erro ao realizar login', () => {

        authServiceMock.login
            .mockReturnValue(
                throwError(
                    () => new Error()
                )
            );

        component.form.patchValue({
            email: 'teste@email.com',
            senha: '123456'
        });

        component.submit();

        expect(
            alertServiceMock.updateToast
        ).toHaveBeenCalled();

    });

    it('deve salvar tenant no contexto apos login', () => {

        component.tenant = {
            id: '1'
        };

        authServiceMock.login
            .mockReturnValue(
                of({})
            );

        component.form.patchValue({
            email: 'teste@email.com',
            senha: '123456'
        });

        component.submit();

        expect(
            tenantContextServiceMock
                .setTenant
        ).toHaveBeenCalledWith(
            component.tenant
        );

    });
})