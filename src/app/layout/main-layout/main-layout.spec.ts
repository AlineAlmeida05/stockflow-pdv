import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MainLayout } from './main-layout';

import { NotificacaoService } from '../../core/services/notificacao.service';

describe('MainLayout', () => {

    let component: MainLayout;
    let fixture: ComponentFixture<MainLayout>;

    const notificacaoServiceMock = {

        listarBadges: () => of([]),

        badgesAtualizados$: of(),

        notificarAtualizacaoBadges: () => { }

    };

    beforeEach(async () => {

        await TestBed.configureTestingModule({

            imports: [
                MainLayout
            ],

            providers: [
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                }
            ]

        }).compileComponents();

        fixture =
            TestBed.createComponent(
                MainLayout
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve iniciar com menu fechado', () => {

        expect(
            component.menuAberto
        ).toBe(false);

    });

    it('deve abrir menu ao alternar quando estiver fechado', () => {

        component.menuAberto = false;

        component.alternarMenu();

        expect(
            component.menuAberto
        ).toBe(true);

    });

    it('deve fechar menu ao alternar quando estiver aberto', () => {

        component.menuAberto = true;

        component.alternarMenu();

        expect(
            component.menuAberto
        ).toBe(false);

    });

    it('deve fechar menu', () => {

        component.menuAberto = true;

        component.fecharMenu();

        expect(
            component.menuAberto
        ).toBe(false);

    });

});