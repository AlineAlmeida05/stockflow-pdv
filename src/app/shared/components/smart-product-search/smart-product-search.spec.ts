import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SmartProductSearch } from './smart-product-search';

describe('SmartProductSearch', () => {

    let component: SmartProductSearch;
    let fixture: ComponentFixture<SmartProductSearch>;

    const produtos = [
        {
            id: '1',
            nome: 'Cerveja Heineken',
            codigo: '001',
            codigoBarras: '111',
            ativo: true
        },
        {
            id: '2',
            nome: 'Vinho Tinto',
            codigo: '002',
            codigoBarras: '222',
            ativo: true
        },
        {
            id: '3',
            nome: 'Produto Inativo',
            codigo: '003',
            codigoBarras: '333',
            ativo: false
        }
    ] as any;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                SmartProductSearch
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                SmartProductSearch
            );

        component =
            fixture.componentInstance;

        component.produtos =
            produtos;

        fixture.detectChanges();

    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve retornar lista vazia sem busca', () => {

        component.textoBusca = '';

        expect(
            component.resultados
        ).toEqual([]);

    });

    it('deve buscar por nome', () => {

        component.textoBusca =
            'heineken';

        expect(
            component.resultados.length
        ).toBe(1);

    });

    it('deve buscar por codigo', () => {

        component.textoBusca =
            '001';

        expect(
            component.resultados.length
        ).toBe(1);

    });

    it('deve buscar por codigo de barras', () => {

        component.textoBusca =
            '111';

        expect(
            component.resultados.length
        ).toBe(1);

    });

    it('deve ignorar produtos inativos', () => {

        component.textoBusca =
            'inativo';

        expect(
            component.resultados.length
        ).toBe(0);

    });

    it('deve selecionar produto', () => {

        const emitSpy =
            vi.spyOn(
                component.produtoSelecionado,
                'emit'
            );

        const produto =
            produtos[0];

        component.selecionarProduto(
            produto
        );

        expect(
            component.textoBusca
        ).toBe(
            produto.nome
        );

        expect(
            component.mostrarResultados
        ).toBe(false);

        expect(
            emitSpy
        ).toHaveBeenCalledWith(
            produto
        );

    });

    it('deve exibir resultados ao buscar', () => {

        component.textoBusca =
            'heineken';

        component.buscar();

        expect(
            component.mostrarResultados
        ).toBe(true);

    });

    it('deve ocultar resultados quando busca estiver vazia', () => {

        component.textoBusca =
            '';

        component.buscar();

        expect(
            component.mostrarResultados
        ).toBe(false);

    });

    it('deve selecionar automaticamente quando houver um resultado pelo codigo', () => {

        const spy =
            vi.spyOn(
                component,
                'selecionarProduto'
            );

        component.textoBusca =
            '001';

        component.buscar();

        expect(
            spy
        ).toHaveBeenCalled();

    });

    it('deve focar input', () => {

        const focus =
            vi.fn();

        const select =
            vi.fn();

        component.produtoInput = {
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

        component.produtoInput =
            undefined;

        expect(
            () => component.focar()
        ).not.toThrow();

    });

    it('deve limpar busca', () => {

        component.textoBusca =
            'teste';

        component.mostrarResultados =
            true;

        component.limpar();

        expect(
            component.textoBusca
        ).toBe('');

        expect(
            component.mostrarResultados
        ).toBe(false);

    });

    it('deve preencher produto com setProduto', () => {

        component.setProduto(
            produtos[0]
        );

        expect(
            component.textoBusca
        ).toBe(
            produtos[0].nome
        );

    });

    it('deve limpar texto quando setProduto receber undefined', () => {

        component.setProduto(
            undefined
        );

        expect(
            component.textoBusca
        ).toBe('');

    });

    it('deve selecionar primeiro resultado quando houver apenas um', () => {

        const spy =
            vi.spyOn(
                component,
                'selecionarProduto'
            );

        component.textoBusca =
            '001';

        component.selecionarPrimeiroResultado();

        expect(
            spy
        ).toHaveBeenCalled();

    });

    it('nao deve selecionar primeiro resultado quando houver mais de um resultado', () => {

        const spy =
            vi.spyOn(
                component,
                'selecionarProduto'
            );

        component.textoBusca =
            'i';

        component.selecionarPrimeiroResultado();

        expect(
            spy
        ).not.toHaveBeenCalled();

    });

    it('deve fechar resultados', () => {

        vi.useFakeTimers();

        component.mostrarResultados =
            true;

        component.fecharResultados();

        vi.advanceTimersByTime(
            150
        );

        expect(
            component.mostrarResultados
        ).toBe(false);

        vi.useRealTimers();

    });
})