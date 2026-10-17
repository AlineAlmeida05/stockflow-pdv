import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { DataTable } from './data-table';

describe('DataTable', () => {

    let component: DataTable;
    let fixture: ComponentFixture<DataTable>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                DataTable
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                DataTable
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve iniciar com showActions false', () => {

        expect(
            component.showActions
        ).toBe(false);

    });

    it('deve iniciar com showEditAction true', () => {

        expect(
            component.showEditAction
        ).toBe(true);

    });

    it('deve iniciar com icone de exclusao padrao', () => {

        expect(
            component.deleteIcon
        ).toBe('🗑️');

    });

    it('deve retornar variant success para Ativo', () => {

        expect(
            component.obterVariantStatus(
                'Ativo'
            )
        ).toBe('success');

    });

    it('deve retornar variant warning para OPERADOR_CAIXA', () => {

        expect(
            component.obterVariantStatus(
                'OPERADOR_CAIXA'
            )
        ).toBe('warning');

    });

    it('deve retornar variant danger para Inativo', () => {

        expect(
            component.obterVariantStatus(
                'Inativo'
            )
        ).toBe('danger');

    });

    it('deve retornar success para status desconhecido', () => {

        expect(
            component.obterVariantStatus(
                'QUALQUER'
            )
        ).toBe('success');

    });

    it('deve formatar moeda', () => {

        expect(
            component.formatCurrency(
                10
            )
        ).toContain('10');

    });

    it('deve retornar traço para moeda invalida', () => {

        expect(
            component.formatCurrency(
                'abc'
            )
        ).toBe('-');

    });

    it('deve formatar data valida', () => {

        const resultado =
            component.formatDate(
                '2026-01-15'
            );

        expect(
            resultado
        ).not.toBe('-');

    });

    it('deve retornar traço para data vazia', () => {

        expect(
            component.formatDate(
                null
            )
        ).toBe('-');

    });

    it('deve retornar traço para data invalida', () => {

        expect(
            component.formatDate(
                'data invalida'
            )
        ).toBe('-');

    });

    it('deve retornar classe success', () => {

        expect(
            component.getBadgeClass(
                'Ativo'
            )
        ).toBe(
            'status-success'
        );

    });

    it('deve retornar classe warning', () => {

        expect(
            component.getBadgeClass(
                'Atenção'
            )
        ).toBe(
            'status-warning'
        );

    });

    it('deve retornar classe danger', () => {

        expect(
            component.getBadgeClass(
                'Crítico'
            )
        ).toBe(
            'status-danger'
        );

    });

    it('deve retornar classe vazia para valor desconhecido', () => {

        expect(
            component.getBadgeClass(
                'Outro'
            )
        ).toBe('');

    });

    it('deve retornar valor numerico do progresso', () => {

        expect(
            component.getProgressValue(
                '75%'
            )
        ).toBe(75);

    });

    it('deve retornar zero para progresso invalido', () => {

        expect(
            component.getProgressValue(
                'abc'
            )
        ).toBe(0);

    });

    it('deve retornar classe progress-danger', () => {

        expect(
            component.getProgressClass(
                '20%'
            )
        ).toBe(
            'progress-danger'
        );

    });

    it('deve retornar classe progress-warning', () => {

        expect(
            component.getProgressClass(
                '40%'
            )
        ).toBe(
            'progress-warning'
        );

    });

    it('deve retornar classe progress-success', () => {

        expect(
            component.getProgressClass(
                '80%'
            )
        ).toBe(
            'progress-success'
        );

    });

    it('deve emitir evento edit', () => {

        const emitSpy =
            vi.spyOn(
                component.edit,
                'emit'
            );

        component.edit.emit({});

        expect(
            emitSpy
        ).toHaveBeenCalled();

    });

    it('deve emitir evento delete', () => {

        const emitSpy =
            vi.spyOn(
                component.delete,
                'emit'
            );

        component.delete.emit({});

        expect(
            emitSpy
        ).toHaveBeenCalled();

    });

    it('deve emitir evento rowClick', () => {

        const emitSpy =
            vi.spyOn(
                component.rowClick,
                'emit'
            );

        component.rowClick.emit({});

        expect(
            emitSpy
        ).toHaveBeenCalled();

    });

});