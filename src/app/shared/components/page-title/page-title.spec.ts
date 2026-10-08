import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTitle } from './page-title';

describe('PageTitle', () => {

    let component: PageTitle;
    let fixture: ComponentFixture<PageTitle>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                PageTitle
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                PageTitle
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

    it('deve permitir definir titulo', () => {

        component.title =
            'Dashboard';

        expect(
            component.title
        ).toBe(
            'Dashboard'
        );

    });

    it('deve permitir definir subtitulo', () => {

        component.subtitle =
            'Resumo geral do sistema';

        expect(
            component.subtitle
        ).toBe(
            'Resumo geral do sistema'
        );

    });

});