import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { EmpresaComponent } from './empresa';
import { EmpresaService } from '../../core/services/empresa.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { notificacaoServiceMock } from '../../../testing/mocks/notificacao-service.mock';

describe('EmpresaComponent', () => {
    let component: EmpresaComponent;
    let fixture: ComponentFixture<EmpresaComponent>;

    const empresaServiceMock = {
        obter: vi.fn()
    };

    const tenantContextServiceMock = {
        tenantAtual: {
            slug: 'empresa-teste',
            nome: 'Empresa Teste'
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmpresaComponent],
            providers: [
                {
                    provide: EmpresaService,
                    useValue: empresaServiceMock
                },
                {
                    provide: TenantContextService,
                    useValue: tenantContextServiceMock
                },
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                },
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EmpresaComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar empresa no ngOnInit', () => {
        const empresaMock = {
            id: 1,
            nome: 'Empresa Teste'
        };

        empresaServiceMock.obter.mockReturnValue(
            of(empresaMock)
        );

        component.ngOnInit();

        expect(empresaServiceMock.obter)
            .toHaveBeenCalled();

        expect(component.empresa)
            .toEqual(empresaMock);
    });

    it('deve tratar erro ao carregar empresa', () => {
        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );


        const erroMock = {
            message: 'Erro teste'
        };

        empresaServiceMock.obter.mockReturnValue(
            throwError(
                () => ({
                    message: 'Erro teste'
                })
            )
        );

        component.ngOnInit();

        expect(consoleSpy).toHaveBeenCalledWith(
            'Erro ao carregar empresa:',
            erroMock
        );

        consoleSpy.mockRestore();
    });

    it('deve retornar tenantAtual', () => {
        expect(component.tenantAtual).toEqual(
            tenantContextServiceMock.tenantAtual
        );
    });
});