import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { EntradaDeEstoque } from './entrada-de-estoque';
import { ProdutoService } from '../../core/services/produto.service';
import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';
import { AlertService } from '../../core/services/alert.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { notificacaoServiceMock } from '../../../testing/mocks/notificacao-service.mock';

describe('EntradaDeEstoque', () => {

    let component: EntradaDeEstoque;
    let fixture: ComponentFixture<EntradaDeEstoque>;

    const produtoServiceMock = {
        listar: vi.fn()
    };

    const movimentacaoServiceMock = {
        listar: vi.fn(),
        registrarEntrada: vi.fn()
    };

    const alertServiceMock = {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn()
    };

    const confirmDialogServiceMock = {
        open: vi.fn()
    };

    beforeEach(async () => {

        produtoServiceMock.listar.mockReturnValue(
            of([])
        );

        movimentacaoServiceMock.listar.mockReturnValue(
            of([])
        );

        await TestBed.configureTestingModule({
            imports: [
                EntradaDeEstoque
            ],
            providers: [
                {
                    provide: ProdutoService,
                    useValue: produtoServiceMock
                },
                {
                    provide: MovimentacaoEstoqueService,
                    useValue: movimentacaoServiceMock
                },
                {
                    provide: AlertService,
                    useValue: alertServiceMock
                },
                {
                    provide: ConfirmDialogService,
                    useValue: confirmDialogServiceMock
                },
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                }
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                EntradaDeEstoque
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar produtos e movimentações no ngOnInit', () => {
        const produtosSpy =
            vi.spyOn(component, 'carregarProdutos');

        const movimentacoesSpy =
            vi.spyOn(component, 'carregarMovimentacoes');

        component.ngOnInit();

        expect(produtosSpy).toHaveBeenCalled();
        expect(movimentacoesSpy).toHaveBeenCalled();
    });

    it('deve selecionar produto', () => {
        const produto = {
            id: '1',
            nome: 'Produto Teste'
        } as any;

        component.selecionarProduto(produto);

        expect(component.produtoSelecionado)
            .toEqual(produto);

        expect(component.produtoSelecionadoId)
            .toBe('1');
    });

    it('deve retornar vazio ao formatar valor undefined', () => {
        expect(
            component.formatarMoeda(undefined)
        ).toBe('');
    });

    it('deve exibir aviso quando produto não for selecionado', () => {

        component.produtoSelecionadoId = '';

        component.adicionarEstoque();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Selecione um produto.'
            );

    });

    it('deve exibir aviso quando quantidade for inválida', () => {

        component.produtoSelecionadoId = '1';
        component.quantidade = null;

        component.adicionarEstoque();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Informe uma quantidade válida.'
            );

    });

    it('deve exibir aviso quando quantidade for menor ou igual a zero', () => {

        component.produtoSelecionadoId = '1';
        component.quantidade = 0;

        component.adicionarEstoque();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Informe uma quantidade válida.'
            );

    });

    it('deve exibir aviso quando preço de compra for inválido', () => {

        component.produtoSelecionadoId = '1';
        component.quantidade = 10;
        component.precoCompra = null;

        component.adicionarEstoque();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Informe o preço de compra.'
            );

    });

    it('deve exibir aviso quando preço de compra for zero', () => {

        component.produtoSelecionadoId = '1';
        component.quantidade = 10;
        component.precoCompra = 0;

        component.adicionarEstoque();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Informe o preço de compra.'
            );

    });

    it('não deve permitir entrada para produto inativo', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Produto Teste',
                ativo: false,
                estoqueAtual: 10,
                estoqueMinimo: 5
            } as any
        ];

        component.produtoSelecionadoId = '1';
        component.quantidade = 10;
        component.precoCompra = 5;

        component.adicionarEstoque();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Este produto está inativo, voce deve ativá-lo antes movimentar estoque!.'
            );

    });

    it('não deve processar entrada quando já estiver processando', () => {

        component.processandoEntrada = true;

        component.adicionarEstoque();

        expect(alertServiceMock.warning)
            .not.toHaveBeenCalled();

    });

    it('deve filtrar produtos pelo texto de busca', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Arroz'
            } as any,
            {
                id: '2',
                nome: 'Feijão'
            } as any
        ];

        component.textoBusca = 'arroz';

        expect(
            component.produtosFiltrados.length
        ).toBe(1);

    });

    it('deve retornar apenas produtos ativos', () => {

        component.produtos = [
            {
                id: '1',
                ativo: true
            } as any,
            {
                id: '2',
                ativo: false
            } as any
        ];

        expect(
            component.produtosAtivos.length
        ).toBe(1);

    });

    it('deve retornar total de produtos filtrados', () => {

        component.produtos = [
            { id: '1', nome: 'Arroz' } as any,
            { id: '2', nome: 'Feijão' } as any
        ];

        expect(component.totalProdutos)
            .toBe(2);

    });

    it('deve calcular total sem estoque', () => {

        component.produtos = [
            {
                nome: 'Produto 1',
                estoqueAtual: 0
            } as any,
            {
                nome: 'Produto 2',
                estoqueAtual: 10
            } as any
        ];

        expect(component.totalSemEstoque)
            .toBe(1);

    });

    it('deve calcular total normal', () => {

        component.produtos = [
            {
                nome: 'Produto 1',
                estoqueAtual: 30,
                estoqueMinimo: 10
            } as any,
            {
                nome: 'Produto 2',
                estoqueAtual: 10,
                estoqueMinimo: 10
            } as any
        ];

        expect(component.totalNormal)
            .toBe(1);

    });

    it('deve calcular total atenção', () => {

        component.produtos = [
            {
                nome: 'Produto 1',
                estoqueAtual: 15,
                estoqueMinimo: 10
            } as any
        ];

        expect(component.totalAtencao)
            .toBe(1);

    });

    it('deve calcular total crítico', () => {

        component.produtos = [
            {
                nome: 'Produto 1',
                estoqueAtual: 5,
                estoqueMinimo: 10
            } as any
        ];

        expect(component.totalCritico)
            .toBe(1);

    });

    it('deve retornar nome do produto selecionado', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Arroz'
            } as any
        ];

        component.produtoSelecionadoId = '1';

        expect(
            component.obterNomeProdutoSelecionado()
        ).toBe('Arroz');

    });

    it('deve retornar opções de produtos', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Arroz'
            } as any
        ];

        const options = component.produtoOptions;

        expect(options).toHaveLength(2);
        expect(options[1].label).toBe('Arroz');

    });

    it('deve retornar apenas movimentações de entrada', () => {

        component.movimentacoes = [
            {
                tipo: 'entrada'
            } as any,
            {
                tipo: 'saida'
            } as any
        ];

        expect(
            component.movimentacoesRecentes
        ).toHaveLength(1);

    });

    it('deve formatar valor em moeda', () => {

        const resultado =
            component.formatarMoeda(10);

        expect(resultado)
            .toContain('10');

    });

    it('deve limpar campos ao cancelar', () => {

        component.produtoSelecionadoId = '1';
        component.quantidade = 10;
        component.precoCompra = 5;

        component.cancelar();

        expect(component.produtoSelecionadoId)
            .toBe('');

        expect(component.quantidade)
            .toBeNull();

        expect(component.precoCompra)
            .toBeNull();

    });

    it('deve abrir diálogo de confirmação para grandes quantidades', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Arroz',
                ativo: true
            } as any
        ];

        component.produtoSelecionadoId = '1';
        component.quantidade = 100;
        component.precoCompra = 10;

        component.adicionarEstoque();

        expect(confirmDialogServiceMock.open)
            .toHaveBeenCalled();

    });

    it('não deve processar quando produto não existir', () => {

        component.produtoSelecionadoId = '999';
        component.quantidade = 10;
        component.precoCompra = 10;

        component.adicionarEstoque();

        expect(confirmDialogServiceMock.open)
            .not.toHaveBeenCalled();

    });

    it('deve carregar movimentações', () => {

        const movimentacoes = [
            {
                tipo: 'entrada'
            }
        ];

        movimentacaoServiceMock.listar
            .mockReturnValue(of(movimentacoes));

        component.carregarMovimentacoes();

        expect(component.movimentacoes)
            .toEqual(movimentacoes);

    });

    it('deve tratar erro ao carregar movimentações', () => {

        const erro = new Error('erro');

        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );


        movimentacaoServiceMock.listar
            .mockReturnValue(
                throwError(() => erro)
            );

        component.carregarMovimentacoes();

        expect(consoleSpy)
            .toHaveBeenCalledWith(erro);

    });

});