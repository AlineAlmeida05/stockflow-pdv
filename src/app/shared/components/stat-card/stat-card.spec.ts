import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCard } from './stat-card';

describe('StatCard', () => {

    let component: StatCard;
    let fixture: ComponentFixture<StatCard>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                StatCard
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                StatCard
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

    it('deve iniciar com subtitulo vazio', () => {

        expect(
            component.subtitle
        ).toBe('');

    });

    it('deve iniciar com valor vazio', () => {

        expect(
            component.value
        ).toBe('');

    });

    it('deve iniciar com variant primary', () => {

        expect(
            component.variant
        ).toBe('primary');

    });

    it('deve iniciar inativo', () => {

        expect(
            component.active
        ).toBe(false);

    });

    it('deve permitir definir propriedades', () => {

        component.title = 'Vendas';
        component.subtitle = 'Hoje';
        component.value = 150;
        component.variant = 'success';
        component.active = true;

        expect(component.title)
            .toBe('Vendas');

        expect(component.subtitle)
            .toBe('Hoje');

        expect(component.value)
            .toBe(150);

        expect(component.variant)
            .toBe('success');

        expect(component.active)
            .toBe(true);

    });

});