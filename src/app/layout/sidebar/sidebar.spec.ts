import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { vi } from 'vitest';

import { Sidebar } from './sidebar';

import { AuthService } from '../../core/services/auth.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

describe('Sidebar', () => {

    let component: Sidebar;
    let fixture: ComponentFixture<Sidebar>;

    let authServiceMock: {
        usuarioLogado: ReturnType<typeof vi.fn>;
    };

    let notificacaoServiceMock: {
        listarBadges: ReturnType<typeof vi.fn>;
        badgesAtualizados$: Subject<void>;
        notificarAtualizacaoBadges: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {

        authServiceMock = {

            usuarioLogado: vi.fn()

        };

        notificacaoServiceMock = {

            listarBadges: vi.fn()
                .mockReturnValue(
                    of([])
                ),

            badgesAtualizados$:
                new Subject<void>(),

            notificarAtualizacaoBadges:
                vi.fn()

        };

        await TestBed.configureTestingModule({

            imports: [
                Sidebar
            ],

            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceMock
                },
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                }
            ]

        }).compileComponents();

        fixture =
            TestBed.createComponent(
                Sidebar
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve carregar badges no ngOnInit', () => {

        expect(
            notificacaoServiceMock
                .listarBadges
        ).toHaveBeenCalled();

    });

    it('deve carregar badges recebidos do servico', () => {

        const badges = [
            {
                modulo: 'clientes',
                totalPendencias: 5
            }
        ];

        notificacaoServiceMock
            .listarBadges
            .mockReturnValue(
                of(badges)
            );

        component['carregarBadges']();

        expect(
            component.badges
        ).toEqual(
            badges
        );

    });

    it('deve recarregar badges quando receber notificacao', () => {

        const carregarSpy =
            vi.spyOn(
                component as any,
                'carregarBadges'
            );

        notificacaoServiceMock
            .badgesAtualizados$
            .next();

        expect(
            carregarSpy
        ).toHaveBeenCalled();

    });

    it('deve emitir evento ao fechar menu', () => {

        const emitSpy =
            vi.spyOn(
                component.closeMenu,
                'emit'
            );

        component.fecharMenu();

        expect(
            emitSpy
        ).toHaveBeenCalled();

    });

    it('deve retornar menu vazio quando nao houver usuario logado', () => {

        authServiceMock
            .usuarioLogado
            .mockReturnValue(
                null
            );

        expect(
            component.menuFiltrado
        ).toEqual([]);

    });

    it('deve filtrar menu pelo perfil do usuario', () => {

        const primeiroItem =
            component.menu[0];

        authServiceMock
            .usuarioLogado
            .mockReturnValue({
                perfil:
                    primeiroItem.perfis[0]
            });

        expect(
            component.menuFiltrado
                .length
        ).toBeGreaterThan(0);

    });

    it('deve retornar badge do modulo', () => {

        component.badges = [
            {
                modulo: 'clientes',
                totalPendencias: 3
            } as any
        ];

        expect(
            component.obterBadge(
                'clientes'
            )
        ).toBe(3);

    });

    it('deve retornar zero quando badge nao existir', () => {

        component.badges = [];

        expect(
            component.obterBadge(
                'clientes'
            )
        ).toBe(0);

    });

});