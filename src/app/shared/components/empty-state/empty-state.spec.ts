import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {

    let component: EmptyState;
    let fixture: ComponentFixture<EmptyState>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                EmptyState
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                EmptyState
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve iniciar com titulo vazio', () => {

        expect(
            component.title
        ).toBe('');

    });

    it('deve iniciar com icone vazio', () => {

        expect(
            component.icon
        ).toBe('');

    });

    it('deve iniciar com mensagem vazia', () => {

        expect(
            component.message
        ).toBe('');

    });

    it('deve permitir definir titulo', () => {

        component.title =
            'Nenhum registro encontrado';

        expect(
            component.title
        ).toBe(
            'Nenhum registro encontrado'
        );

    });

    it('deve permitir definir icone', () => {

        component.icon =
            '📦';

        expect(
            component.icon
        ).toBe('📦');

    });

    it('deve permitir definir mensagem', () => {

        component.message =
            'Não existem dados cadastrados';

        expect(
            component.message
        ).toBe(
            'Não existem dados cadastrados'
        );

    });

});