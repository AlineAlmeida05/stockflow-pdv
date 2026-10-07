import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ActionIcons } from './action-icons';

describe('ActionIcons', () => {

    let component: ActionIcons;
    let fixture: ComponentFixture<ActionIcons>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                ActionIcons
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                ActionIcons
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve iniciar com showEdit igual a true', () => {

        expect(
            component.showEdit
        ).toBe(true);

    });

    it('deve iniciar com icone de exclusao padrao', () => {

        expect(
            component.deleteIcon
        ).toBe('🗑️');

    });

    it('deve emitir evento de edicao', () => {

        const emitSpy =
            vi.spyOn(
                component.edit,
                'emit'
            );

        component.edit.emit();

        expect(
            emitSpy
        ).toHaveBeenCalled();

    });

    it('deve emitir evento de exclusao', () => {

        const emitSpy =
            vi.spyOn(
                component.delete,
                'emit'
            );

        component.delete.emit();

        expect(
            emitSpy
        ).toHaveBeenCalled();

    });

});