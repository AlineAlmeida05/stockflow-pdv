import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SearchInput } from './search-input';

describe('SearchInput', () => {

    let component: SearchInput;
    let fixture: ComponentFixture<SearchInput>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                SearchInput
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                SearchInput
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve iniciar com placeholder padrao', () => {

        expect(
            component.placeholder
        ).toBe('Buscar...');

    });

    it('deve iniciar com valor vazio', () => {

        expect(
            component.value
        ).toBe('');

    });

    it('deve permitir alterar placeholder', () => {

        component.placeholder =
            'Pesquisar cliente';

        expect(
            component.placeholder
        ).toBe(
            'Pesquisar cliente'
        );

    });

    it('deve permitir alterar valor', () => {

        component.value =
            'João';

        expect(
            component.value
        ).toBe('João');

    });

    it('deve emitir string vazia ao limpar', () => {

        const emitSpy =
            vi.spyOn(
                component.valueChange,
                'emit'
            );

        component.limpar();

        expect(
            emitSpy
        ).toHaveBeenCalledWith('');

    });

    it('deve focar e selecionar input', () => {

        const focus =
            vi.fn();

        const select =
            vi.fn();

        component.searchInput = {
            nativeElement: {
                focus,
                select
            }
        } as any;

        component.focar();

        expect(
            focus
        ).toHaveBeenCalled();

        expect(
            select
        ).toHaveBeenCalled();

    });

    it('nao deve falhar ao focar sem input', () => {

        component.searchInput =
            undefined;

        expect(
            () => component.focar()
        ).not.toThrow();

    });

});
