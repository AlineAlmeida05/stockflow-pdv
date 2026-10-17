import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ExpandableCard } from './expandable-card';

describe('ExpandableCard', () => {

    let component: ExpandableCard;
    let fixture: ComponentFixture<ExpandableCard>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                ExpandableCard
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                ExpandableCard
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve iniciar com title vazio', () => {

        expect(
            component.title
        ).toBe('');

    });

    it('deve iniciar recolhido', () => {

        expect(
            component.expanded
        ).toBe(false);

    });

    it('deve iniciar como colapsavel', () => {

        expect(
            component.collapsible
        ).toBe(true);

    });

    it('deve iniciar com icone vazio', () => {

        expect(
            component.icon
        ).toBe('');

    });

    it('deve expandir ao executar toggle', () => {

        component.expanded = false;

        component.toggle();

        expect(
            component.expanded
        ).toBe(true);

    });

    it('deve recolher ao executar toggle', () => {

        component.expanded = true;

        component.toggle();

        expect(
            component.expanded
        ).toBe(false);

    });

    it('deve emitir expandedChange ao expandir', () => {

        const emitSpy =
            vi.spyOn(
                component.expandedChange,
                'emit'
            );

        component.expanded = false;

        component.toggle();

        expect(
            emitSpy
        ).toHaveBeenCalledWith(
            true
        );

    });

    it('nao deve alterar estado quando nao for colapsavel', () => {

        component.collapsible = false;
        component.expanded = false;

        component.toggle();

        expect(
            component.expanded
        ).toBe(false);

    });

    it('nao deve emitir evento quando nao for colapsavel', () => {

        component.collapsible = false;

        const emitSpy =
            vi.spyOn(
                component.expandedChange,
                'emit'
            );

        component.toggle();

        expect(
            emitSpy
        ).not.toHaveBeenCalled();

    });

});