import { Produtos } from './produtos';
import { of } from 'rxjs';
import { vi } from 'vitest';


describe(
    'Produtos',
    () => {

        let component: Produtos;

        beforeEach(() => {

            component =
                new Produtos(
                    {} as never,
                    {} as never,
                    {} as never,
                    {} as never
                );

        });

        it(
            'deve retornar todos os produtos quando a busca estiver vazia',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky'
                    } as never,
                    {
                        nome: 'Cerveja'
                    } as never
                ];

                component.textoBusca = '';

                expect(
                    component.produtosFiltrados.length
                ).toBe(2);

            }
        );

        it(
            'deve filtrar produtos pelo nome',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky'
                    } as never,
                    {
                        nome: 'Cerveja'
                    } as never,
                    {
                        nome: 'Vodka'
                    } as never
                ];

                component.textoBusca = 'whi';

                expect(
                    component.produtosFiltrados.length
                ).toBe(1);

                expect(
                    component.produtosFiltrados[0].nome
                ).toBe('Whisky');

            }
        );

        it(
            'deve ignorar maiúsculas e minúsculas na busca',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky'
                    } as never
                ];

                component.textoBusca = 'WHISKY';

                expect(
                    component.produtosFiltrados.length
                ).toBe(1);

            }
        );

        it(
            'deve exibir "-" quando o produto não possuir preço promocional',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky',
                        ativo: true,
                        precoPromocional: 0
                    } as never
                ];

                const resultado =
                    component.produtosTabela as any[];

                expect(
                    resultado[0]
                        .precoPromocional
                ).toBe('-');

            }
        );

        it(
            'deve exibir status Ativo para produtos ativos',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky',
                        ativo: true
                    } as never
                ];

                const resultado =
                    component.produtosTabela as any[];

                expect(
                    resultado[0].status
                ).toBe('Ativo');

            }
        );

        it(
            'deve exibir status Inativo para produtos inativos',
            () => {

                component.produtos = [
                    {
                        nome: 'Whisky',
                        ativo: false
                    } as never
                ];

                const resultado =
                    component.produtosTabela as any[];

                expect(
                    resultado[0].status
                ).toBe('Inativo');

            }
        );

        it(
            'deve exibir aviso quando o nome estiver vazio',
            () => {

                const alertService = {
                    warning: vi.fn()
                };

                component =
                    new Produtos(
                        {} as never,
                        {} as never,
                        alertService as never,
                        {} as never
                    );

                component.nome = '';

                component.salvarProduto();

                expect(
                    alertService.warning
                ).toHaveBeenCalledWith(
                    'Informe o nome do produto.'
                );

            }
        );

        it(
            'deve exibir aviso quando o nome estiver vazio',
            () => {

                const alertService = {
                    warning: vi.fn()
                };

                component =
                    new Produtos(
                        {} as never,
                        {} as never,
                        alertService as never,
                        {} as never
                    );

                component.nome = '';
                component.estoqueMinimo = 10;
                component.precoVenda = 10;

                component.salvarProduto();

                expect(
                    alertService.warning
                ).toHaveBeenCalledWith(
                    'Informe o nome do produto.'
                );

            }
        );

        it(
            'deve exibir aviso quando o estoque mínimo for inválido',
            () => {

                const alertService = {
                    warning: vi.fn()
                };

                component =
                    new Produtos(
                        {} as never,
                        {} as never,
                        alertService as never,
                        {} as never
                    );

                component.nome = 'Whisky';
                component.estoqueMinimo = 0;
                component.precoVenda = 10;

                component.salvarProduto();

                expect(
                    alertService.warning
                ).toHaveBeenCalledWith(
                    'Informe um estoque mínimo válido.'
                );

            }
        );

        it(
            'deve exibir aviso quando o preço de venda for inválido',
            () => {

                const alertService = {
                    warning: vi.fn()
                };

                component =
                    new Produtos(
                        {} as never,
                        {} as never,
                        alertService as never,
                        {} as never
                    );

                component.nome = 'Whisky';
                component.estoqueMinimo = 10;
                component.precoVenda = 0;

                component.salvarProduto();

                expect(
                    alertService.warning
                ).toHaveBeenCalledWith(
                    'Informe um preço de venda válido.'
                );

            }
        );

        it(
            'não deve continuar quando já estiver salvando',
            () => {

                const produtoService = {
                    salvar: vi.fn()
                };

                component =
                    new Produtos(
                        produtoService as never,
                        {} as never,
                        {} as never,
                        {} as never
                    );

                component.salvandoProduto = true;

                component.salvarProduto();

                expect(
                    produtoService.salvar
                ).not.toHaveBeenCalled();

            }
        );

        it(
            'deve retornar ícone de pausa para produto ativo',
            () => {

                expect(
                    component.produtoDeleteIcon({
                        ativo: true
                    } as never)
                ).toBe('⏸️');

            }
        );

        it(
            'deve retornar ícone de play para produto inativo',
            () => {

                expect(
                    component.produtoDeleteIcon({
                        ativo: false
                    } as never)
                ).toBe('▶️');

            }
        );

        it(
            'deve retornar vazio para valor undefined',
            () => {

                expect(
                    component.formatarMoeda(undefined)
                ).toBe('');

            }
        );

        it(
            'deve formatar moeda em reais',
            () => {

                expect(
                    component.formatarMoeda(100)
                ).toContain('100');

            }
        );

        it(
            'deve cadastrar produto com sucesso',
            () => {

                const produtoService = {
                    salvar: vi.fn(() => of({})),
                    listar: vi.fn(() => of([]))
                };


                const alertService = {
                    info: vi.fn(),
                    success: vi.fn(),
                    error: vi.fn()
                };

                component =
                    new Produtos(
                        produtoService as never,
                        {} as never,
                        alertService as never,
                        {
                            detectChanges: vi.fn()
                        } as never
                    );

                component.nome = 'Whisky';

                component.estoqueMinimo = 10;

                component.precoVenda = 50;

                component.salvarProduto();

                expect(
                    produtoService.salvar
                ).toHaveBeenCalled();

                expect(
                    alertService.success
                ).toHaveBeenCalledWith(
                    'Produto cadastrado com sucesso.'
                );

                expect(
                    component.nome
                ).toBe('');

                expect(
                    component.precoVenda
                ).toBe(0);

                expect(
                    component.estoqueMinimo
                ).toBe(0);

            }
        );

        it(
            'deve atualizar produto com sucesso',
            () => {

                const produtoService = {
                    atualizar: vi.fn(() => of({})),
                    listar: vi.fn(() => of([]))
                };

                const alertService = {
                    info: vi.fn(),
                    success: vi.fn(),
                    error: vi.fn()
                };

                component =
                    new Produtos(
                        produtoService as never,
                        {} as never,
                        alertService as never,
                        {
                            detectChanges: vi.fn()
                        } as never
                    );

                component.produtoEditandoId = '1';

                component.nome = 'Whisky';

                component.estoqueMinimo = 10;

                component.precoVenda = 50;

                component.salvarProduto();

                expect(
                    produtoService.atualizar
                ).toHaveBeenCalled();

                expect(
                    alertService.success
                ).toHaveBeenCalledWith(
                    'Produto atualizado com sucesso.'
                );

            }
        );

    }
);
