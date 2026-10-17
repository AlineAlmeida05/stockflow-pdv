import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SelectInput } from './select-input';

describe('SelectInput', () => {

    let component: SelectInput;
    let fixture: ComponentFixture<SelectInput>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                SelectInput
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                SelectInput
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve iniciar com label vazio', () => {

        expect(
            component.label
        ).toBe('');

    });

    it('deve iniciar com valor vazio', () => {

        expect(
            component.value
        ).toBe('');

    });

    it('deve iniciar com placeholder vazio', () => {

        expect(
            component.placeholder
        ).toBe('');

    });

    it('deve iniciar habilitado', () => {

        expect(
            component.disabled
        ).toBe(false);

    });

    it('deve iniciar com size md', () => {

        expect(
            component.size
        ).toBe('md');

    });

    it('deve permitir definir opcoes', () => {

        component.options = [
            {
                value: '1',
                label: 'Opção 1'
            }
        ];

        expect(
            component.options.length
        ).toBe(1);

    });

    it('deve focar select', () => {

        const focus =
            vi.fn();

        component.selectInput = {
            nativeElement: {
                focus
            }
        } as any;

        component.focar();

        expect(
            focus
        ).toHaveBeenCalled();

    });

    it('nao deve falhar ao focar sem select', () => {

        component.selectInput =
            undefined;

        expect(
            () => component.focar()
        ).not.toThrow();

    });

});