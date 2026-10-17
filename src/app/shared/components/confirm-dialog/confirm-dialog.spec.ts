import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ConfirmDialog } from './confirm-dialog';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

describe('ConfirmDialog', () => {

    let component: ConfirmDialog;
    let fixture: ComponentFixture<ConfirmDialog>;

    let confirmDialogServiceMock: any;

    beforeEach(async () => {

        confirmDialogServiceMock = {

            currentDialog: null,

            close: vi.fn()

        };

        await TestBed.configureTestingModule({

            imports: [
                ConfirmDialog
            ],

            providers: [
                {
                    provide: ConfirmDialogService,
                    useValue: confirmDialogServiceMock
                }
            ]

        }).compileComponents();

        fixture =
            TestBed.createComponent(
                ConfirmDialog
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('nao deve cancelar ao pressionar ESC sem dialog aberto', () => {

        const cancelarSpy =
            vi.spyOn(
                component,
                'cancelar'
            );

        component.onEscape();

        expect(
            cancelarSpy
        ).not.toHaveBeenCalled();

    });

    it('deve cancelar ao pressionar ESC com dialog aberto', () => {

        confirmDialogServiceMock.currentDialog = {};

        const cancelarSpy =
            vi.spyOn(
                component,
                'cancelar'
            );

        component.onEscape();

        expect(
            cancelarSpy
        ).toHaveBeenCalled();

    });

    it('nao deve confirmar sem dialog', () => {

        component.confirmar();

        expect(
            confirmDialogServiceMock.close
        ).not.toHaveBeenCalled();

    });

    it('deve confirmar dialog', () => {

        const onConfirm =
            vi.fn();

        confirmDialogServiceMock.currentDialog = {
            onConfirm
        };

        component.confirmar();

        expect(
            confirmDialogServiceMock.close
        ).toHaveBeenCalled();

        expect(
            onConfirm
        ).toHaveBeenCalled();

    });

    it('deve cancelar dialog', () => {

        component.cancelar();

        expect(
            confirmDialogServiceMock.close
        ).toHaveBeenCalled();

    });

    it('deve retornar tipo warning por padrao', () => {

        expect(
            component.dialogType
        ).toBe('warning');

    });

    it('deve retornar icone danger', () => {

        confirmDialogServiceMock.currentDialog = {
            type: 'danger'
        };

        expect(
            component.dialogIcon
        ).toBe('🗑️');

    });

    it('deve retornar icone info', () => {

        confirmDialogServiceMock.currentDialog = {
            type: 'info'
        };

        expect(
            component.dialogIcon
        ).toBe('ℹ️');

    });

    it('deve retornar texto personalizado de confirmacao', () => {

        confirmDialogServiceMock.currentDialog = {
            confirmText: 'Prosseguir'
        };

        expect(
            component.confirmButtonText
        ).toBe('Prosseguir');

    });

    it('deve retornar texto padrao para danger', () => {

        confirmDialogServiceMock.currentDialog = {
            type: 'danger'
        };

        expect(
            component.confirmButtonText
        ).toBe('Excluir');

    });

});