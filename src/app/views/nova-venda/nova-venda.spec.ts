import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { NovaVenda } from './nova-venda';
import { ProdutoService } from '../../core/services/produto.service';
import { VendaService } from '../../core/services/venda.service';
import { ClienteService } from '../../core/services/cliente.service';
import { AlertService } from '../../core/services/alert.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { notificacaoServiceMock } from '../../../testing/mocks/notificacao-service.mock';

describe('NovaVenda', () => {

    let component: NovaVenda;
    let fixture: ComponentFixture<NovaVenda>;

    const produtoServiceMock = {
        listar: vi.fn()
    };

    const vendaServiceMock = {
        salvar: vi.fn()
    };

    const clienteServiceMock = {
        listar: vi.fn(),
        obterResumo: vi.fn()
    };

    const alertServiceMock = {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn()
    };

    const confirmDialogServiceMock = {
        open: vi.fn()
    };

    beforeEach(async () => {

        produtoServiceMock.listar.mockReturnValue(
            of([])
        );

        clienteServiceMock.listar.mockReturnValue(
            of([])
        );

        vendaServiceMock.salvar.mockReturnValue(
            of({})
        );

        await TestBed.configureTestingModule({
            imports: [NovaVenda],
            providers: [
                {
                    provide: ProdutoService,
                    useValue: produtoServiceMock
                },
                {
                    provide: VendaService,
                    useValue: vendaServiceMock
                },
                {
                    provide: ClienteService,
                    useValue: clienteServiceMock
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
                },
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                NovaVenda
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();

        component.smartProductSearch = {
            focar: vi.fn(),
            limpar: vi.fn()
        } as any;

    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('deve criar o componente', () => {

        expect(component)
            .toBeTruthy();

    });

    it('deve carregar produtos e clientes no ngOnInit', () => {

        const produtosSpy =
            vi.spyOn(component, 'carregarProdutos');

        const clientesSpy =
            vi.spyOn(component, 'carregarClientes');

        component.ngOnInit();

        expect(produtosSpy)
            .toHaveBeenCalled();

        expect(clientesSpy)
            .toHaveBeenCalled();

    });

    it('deve carregar produtos', () => {

        const produtos = [
            {
                id: '1',
                nome: 'Arroz'
            }
        ];

        produtoServiceMock.listar
            .mockReturnValue(
                of(produtos)
            );

        component.carregarProdutos();

        expect(component.produtos)
            .toEqual(produtos);

    });

    it('deve tratar erro ao carregar produtos', () => {

        const erro =
            new Error('erro');

        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );

        produtoServiceMock.listar
            .mockReturnValue(
                throwError(() => erro)
            );

        component.carregarProdutos();

        expect(consoleSpy)
            .toHaveBeenCalledWith(
                erro
            );

    });

    it('deve carregar clientes', () => {

        const clientes = [
            {
                id: '1',
                nome: 'Cliente Teste'
            }
        ];

        clienteServiceMock.listar
            .mockReturnValue(
                of(clientes)
            );

        component.carregarClientes();

        expect(component.clientes)
            .toEqual(clientes);

    });

    it('deve tratar erro ao carregar clientes', () => {

        const erro =
            new Error('erro');

        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );

        clienteServiceMock.listar
            .mockReturnValue(
                throwError(() => erro)
            );

        component.carregarClientes();

        expect(consoleSpy)
            .toHaveBeenCalledWith(
                erro
            );

    });

    it('deve calcular total do carrinho', () => {

        component.carrinho = [
            {
                subtotal: 10
            } as any,
            {
                subtotal: 25
            } as any
        ];

        expect(component.total)
            .toBe(35);

    });

    it('deve calcular quantidade total de itens', () => {

        component.carrinho = [
            {
                quantidade: 2
            } as any,
            {
                quantidade: 3
            } as any
        ];

        expect(component.quantidadeTotalItens)
            .toBe(5);

    });

    it('deve retornar quantidade de itens', () => {

        component.carrinho = [
            {
                quantidade: 1
            } as any,
            {
                quantidade: 4
            } as any
        ];

        expect(component.quantidadeItens)
            .toBe(5);

    });

    it('deve calcular troco', () => {

        component.formaPagamento = 'dinheiro';

        component.carrinho = [
            {
                subtotal: 50
            } as any
        ];

        component.valorRecebido = 70;

        expect(component.troco)
            .toBe(20);

    });

    it('deve retornar zero de troco quando não for dinheiro', () => {

        component.formaPagamento = 'pix';

        component.valorRecebido = 100;

        expect(component.troco)
            .toBe(0);

    });

    it('deve retornar descrição PIX', () => {

        component.formaPagamento = 'pix';

        expect(
            component.formaPagamentoDescricao
        ).toBe('PIX');

    });

    it('deve retornar descrição Dinheiro', () => {

        component.formaPagamento = 'dinheiro';

        expect(
            component.formaPagamentoDescricao
        ).toBe('Dinheiro');

    });

    it('deve retornar descrição Débito', () => {

        component.formaPagamento = 'debito';

        expect(
            component.formaPagamentoDescricao
        ).toBe('Débito');

    });

    it('deve retornar descrição Crédito', () => {

        component.formaPagamento = 'credito';

        expect(
            component.formaPagamentoDescricao
        ).toBe('Crédito');

    });

    it('deve retornar descrição Fiado', () => {

        component.formaPagamento = 'fiado';

        expect(
            component.formaPagamentoDescricao
        ).toBe('Fiado');

    });

    it('deve retornar descrição padrão', () => {

        component.formaPagamento =
            'Selecione...';

        expect(
            component.formaPagamentoDescricao
        ).toBe('Não informado');

    });

    it('deve retornar produto selecionado', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Arroz'
            } as any
        ];

        component.produtoSelecionadoId = '1';

        expect(
            component.produtoSelecionado?.id
        ).toBe('1');

    });

    it('deve retornar undefined quando produto não existir', () => {

        component.produtoSelecionadoId = '999';

        expect(
            component.produtoSelecionado
        ).toBeUndefined();

    });

    it('deve retornar alto quando não existir produto selecionado', () => {

        expect(
            component.statusEstoque
        ).toBe('alto');

    });

    it('deve retornar baixo quando estoque for menor ou igual a 5', () => {

        component.produtos = [
            {
                id: '1',
                estoqueAtual: 5
            } as any
        ];

        component.produtoSelecionadoId = '1';

        expect(
            component.statusEstoque
        ).toBe('baixo');

    });

    it('deve retornar medio quando estoque for menor ou igual a 10', () => {

        component.produtos = [
            {
                id: '1',
                estoqueAtual: 10
            } as any
        ];

        component.produtoSelecionadoId = '1';

        expect(
            component.statusEstoque
        ).toBe('medio');

    });

    it('deve retornar alto quando estoque for maior que 10', () => {

        component.produtos = [
            {
                id: '1',
                estoqueAtual: 20
            } as any
        ];

        component.produtoSelecionadoId = '1';

        expect(
            component.statusEstoque
        ).toBe('alto');

    });

    it('deve exibir aviso ao selecionar produto inativo', () => {

        const produto = {
            id: '1',
            ativo: false,
            estoqueAtual: 10
        } as any;

        component.selecionarProduto(produto);

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Este produto está inativo.'
            );

    });

    it('deve exibir aviso ao selecionar produto sem estoque', () => {

        const produto = {
            id: '1',
            ativo: true,
            estoqueAtual: 0
        } as any;

        component.selecionarProduto(produto);

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Produto sem estoque disponível.'
            );

    });

    it('deve selecionar produto válido', () => {

        const focarSpy =
            vi.spyOn(component, 'focarQuantidade');

        const produto = {
            id: '1',
            ativo: true,
            estoqueAtual: 10
        } as any;

        component.selecionarProduto(produto);

        expect(component.produtoSelecionadoId)
            .toBe('1');

        expect(component.quantidade)
            .toBe(1);

        expect(focarSpy)
            .toHaveBeenCalled();

    });

    it('não deve adicionar item quando já estiver processando', () => {

        component.adicionandoItem = true;

        component.adicionarAoCarrinho();

        expect(alertServiceMock.warning)
            .not.toHaveBeenCalled();

    });

    it('deve exibir aviso quando produto não for selecionado', () => {

        component.produtoSelecionadoId = '';

        component.adicionarAoCarrinho();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Selecione um produto.'
            );

    });

    it('deve exibir aviso quando quantidade for inválida', () => {

        component.produtoSelecionadoId = '1';
        component.quantidade = null;

        component.adicionarAoCarrinho();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Informe uma quantidade válida.'
            );

    });

    it('deve exibir aviso quando quantidade for zero', () => {

        component.produtoSelecionadoId = '1';
        component.quantidade = 0;

        component.adicionarAoCarrinho();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Informe uma quantidade válida.'
            );

    });

    it('não deve adicionar produto inexistente', () => {

        component.produtoSelecionadoId = '999';
        component.quantidade = 1;

        component.adicionarAoCarrinho();

        expect(component.carrinho)
            .toHaveLength(0);

    });

    it('deve exibir aviso quando produto estiver inativo', () => {

        component.produtos = [
            {
                id: '1',
                ativo: false,
                estoqueAtual: 10
            } as any
        ];

        component.produtoSelecionadoId = '1';
        component.quantidade = 1;

        component.adicionarAoCarrinho();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Produto inativo.'
            );

    });

    it('deve exibir aviso quando estoque for insuficiente', () => {

        component.produtos = [
            {
                id: '1',
                ativo: true,
                estoqueAtual: 2,
                precoVenda: 10
            } as any
        ];

        component.produtoSelecionadoId = '1';
        component.quantidade = 3;

        component.adicionarAoCarrinho();

        expect(alertServiceMock.warning)
            .toHaveBeenCalled();

    });

    it('deve adicionar item ao carrinho', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Arroz',
                ativo: true,
                estoqueAtual: 10,
                precoVenda: 20,
                promocaoAtiva: false
            } as any
        ];

        component.produtoSelecionadoId = '1';
        component.quantidade = 2;

        component.adicionarAoCarrinho();

        expect(component.carrinho)
            .toHaveLength(1);

        expect(component.carrinho[0].subtotal)
            .toBe(40);

    });

    it('deve aplicar preço promocional', () => {

        component.produtos = [
            {
                id: '1',
                nome: 'Arroz',
                ativo: true,
                estoqueAtual: 10,
                precoVenda: 20,
                precoPromocional: 15,
                promocaoAtiva: true
            } as any
        ];

        component.produtoSelecionadoId = '1';
        component.quantidade = 2;

        component.adicionarAoCarrinho();

        expect(
            component.carrinho[0].precoUnitario
        ).toBe(15);

    });

    it('deve atualizar item já existente no carrinho', () => {

        const produto = {
            id: '1',
            nome: 'Arroz',
            ativo: true,
            estoqueAtual: 20,
            precoVenda: 10,
            promocaoAtiva: false
        } as any;

        component.produtos = [produto];

        component.carrinho = [
            {
                produto,
                quantidade: 2,
                precoUnitario: 10,
                subtotal: 20
            } as any
        ];

        component.produtoSelecionadoId = '1';
        component.quantidade = 3;

        component.adicionarAoCarrinho();

        expect(component.carrinho)
            .toHaveLength(1);

        expect(
            component.carrinho[0].quantidade
        ).toBe(5);

    });

    it('não deve finalizar venda quando já estiver processando', () => {

        component.finalizandoVenda = true;

        component.finalizarVenda();

        expect(alertServiceMock.warning)
            .not.toHaveBeenCalled();

    });

    it('deve exigir forma de pagamento', () => {

        component.formaPagamento =
            'Selecione...';

        component.finalizarVenda();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Selecione uma forma de pagamento.'
            );

    });

    it('deve validar valor recebido em dinheiro', () => {

        component.formaPagamento =
            'dinheiro';

        component.carrinho = [
            {
                subtotal: 100
            } as any
        ];

        component.valorRecebido = 50;

        component.finalizarVenda();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Valor recebido insuficiente.'
            );

    });

    it('não deve finalizar carrinho vazio', () => {

        component.formaPagamento = 'pix';

        component.carrinho = [];

        component.finalizarVenda();

        expect(component.finalizandoVenda)
            .toBe(false);

    });

    it('deve exigir cliente para venda fiado', () => {

        component.formaPagamento = 'fiado';

        component.carrinho = [
            {
                subtotal: 10
            } as any
        ];

        component.clienteSelecionadoId = '';

        component.finalizarVenda();

        expect(alertServiceMock.warning)
            .toHaveBeenCalledWith(
                'Selecione um cliente para vender fiado.'
            );

    });

    it('não deve permitir venda para cliente inadimplente', () => {

        component.formaPagamento = 'fiado';

        component.carrinho = [
            {
                subtotal: 10
            } as any
        ];

        component.clienteSelecionadoId = '1';

        component.resumoCliente = {
            status: 'Inadimplente'
        } as any;

        component.finalizarVenda();

        expect(alertServiceMock.error)
            .toHaveBeenCalledWith(
                'Cliente inadimplente. Venda fiado não permitida.'
            );

    });

    it('deve bloquear venda quando crédito for insuficiente', () => {

        component.formaPagamento = 'fiado';

        component.clienteSelecionadoId = '1';

        component.carrinho = [
            {
                subtotal: 200
            } as any
        ];

        component.resumoCliente = {
            status: 'Ativo',
            creditoDisponivel: 100
        } as any;

        component.finalizarVenda();

        expect(alertServiceMock.error)
            .toHaveBeenCalled();

    });

    it('deve chamar salvarVenda quando dados forem válidos', () => {

        const salvarSpy =
            vi.spyOn(
                component as any,
                'salvarVenda'
            );

        component.formaPagamento = 'pix';

        component.carrinho = [
            {
                produto: {
                    id: '1'
                },
                quantidade: 2,
                subtotal: 20
            } as any
        ];

        component.finalizarVenda();

        expect(salvarSpy)
            .toHaveBeenCalled();

    });

    it('deve retornar true para cliente inadimplente', () => {

        component.formaPagamento = 'fiado';

        component.resumoCliente = {
            status: 'Inadimplente'
        } as any;

        expect(component.clienteBloqueadoFiado)
            .toBe(true);

    });

    it('deve retornar true para limite excedido', () => {

        component.formaPagamento = 'fiado';

        component.resumoCliente = {
            status: 'Limite Excedido'
        } as any;

        expect(component.clienteBloqueadoFiado)
            .toBe(true);

    });

    it('deve retornar false para cliente ativo', () => {

        component.formaPagamento = 'fiado';

        component.resumoCliente = {
            status: 'Ativo'
        } as any;

        expect(component.clienteBloqueadoFiado)
            .toBe(false);

    });

    it('deve retornar true quando crédito for insuficiente', () => {

        component.formaPagamento = 'fiado';

        component.carrinho = [
            {
                subtotal: 200
            } as any
        ];

        component.resumoCliente = {
            creditoDisponivel: 100
        } as any;

        expect(component.creditoInsuficiente)
            .toBe(true);

    });

    it('deve retornar false quando crédito for suficiente', () => {

        component.formaPagamento = 'fiado';

        component.carrinho = [
            {
                subtotal: 50
            } as any
        ];

        component.resumoCliente = {
            creditoDisponivel: 100
        } as any;

        expect(component.creditoInsuficiente)
            .toBe(false);

    });

    it('deve carregar resumo do cliente', () => {

        const resumo = {
            status: 'Ativo'
        };

        clienteServiceMock.obterResumo
            .mockReturnValue(of(resumo));

        component.clienteSelecionadoId = '1';

        component.carregarResumoCliente();

        expect(component.resumoCliente)
            .toEqual(resumo);

    });

    it('deve limpar resumo quando não houver cliente selecionado', () => {

        component.resumoCliente = {
            status: 'Ativo'
        } as any;

        component.clienteSelecionadoId = '';

        component.carregarResumoCliente();

        expect(component.resumoCliente)
            .toBeUndefined();

    });

    it('deve tratar erro ao carregar resumo do cliente', () => {

        const erro =
            new Error('erro');

        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );

        clienteServiceMock.obterResumo
            .mockReturnValue(
                throwError(() => erro)
            );

        component.clienteSelecionadoId = '1';

        component.carregarResumoCliente();

        expect(consoleSpy)
            .toHaveBeenCalledWith(
                erro
            );

    });

    it('deve remover item do carrinho', () => {

        component.carrinho = [
            {
                produto: { id: '1' }
            } as any,
            {
                produto: { id: '2' }
            } as any
        ];

        component.removerItem('1');

        expect(component.carrinho)
            .toHaveLength(1);

    });

    it('deve abrir dialog ao remover item do carrinho', () => {

        component.removerItemCarrinho({
            produtoId: '1',
            produtoNome: 'Arroz'
        });

        expect(
            confirmDialogServiceMock.open
        ).toHaveBeenCalled();

    });

    it('deve remover item ao confirmar dialog', () => {

        component.carrinho = [
            {
                produto: { id: '1' }
            } as any
        ];

        component.removerItemCarrinho({
            produtoId: '1',
            produtoNome: 'Arroz'
        });

        const config =
            confirmDialogServiceMock.open
                .mock.calls[0][0];

        config.onConfirm();

        expect(component.carrinho)
            .toHaveLength(0);

    });

    it('deve limpar produto ao pressionar ESC', () => {

        component.produtoSelecionadoId = '1';

        component.onKeyDown(
            new KeyboardEvent('keydown', {
                key: 'Escape'
            })
        );

        expect(component.produtoSelecionadoId)
            .toBe('');

    });

    it('deve executar F3 sem erro', () => {

        component.smartProductSearch = {
            focar: vi.fn(),
            limpar: vi.fn()
        } as any;

        expect(() =>
            component.onKeyDown(
                new KeyboardEvent(
                    'keydown',
                    { key: 'F3' }
                )
            )
        ).not.toThrow();

    });

    it('deve chamar focar ao pressionar F3', () => {

        const focar = vi.fn();

        component.smartProductSearch = {
            focar,
            limpar: vi.fn()
        } as any;

        component.onKeyDown(
            new KeyboardEvent('keydown', {
                key: 'F3'
            })
        );

        expect(focar.mock.calls.length)
            .toBeGreaterThan(0);

    });

    it('deve focar pagamento ao pressionar F4', () => {

        const spy =
            vi.spyOn(
                component,
                'focarPagamento'
            );

        component.onKeyDown(
            new KeyboardEvent(
                'keydown',
                { key: 'F4' }
            )
        );

        expect(spy)
            .toHaveBeenCalled();

    });

    it('deve finalizar venda ao pressionar F2', () => {

        component.carrinho = [
            {
                subtotal: 10
            } as any
        ];

        const spy =
            vi.spyOn(
                component,
                'finalizarVenda'
            );

        component.onKeyDown(
            new KeyboardEvent(
                'keydown',
                { key: 'F2' }
            )
        );

        expect(spy)
            .toHaveBeenCalled();

    });

    it('deve focar forma de pagamento', () => {

        const focus = vi.fn();

        component.formaPagamentoSelect = {
            nativeElement: {
                focus
            }
        } as any;

        component.focarPagamento();

        expect(focus)
            .toHaveBeenCalled();

    });

    it('deve focar quantidade', async () => {

        const focus = vi.fn();
        const select = vi.fn();

        component.quantidadeInput = {
            nativeElement: {
                focus,
                select
            }
        } as any;

        component.focarQuantidade();

        await new Promise(
            resolve =>
                setTimeout(resolve)
        );

        expect(focus)
            .toHaveBeenCalled();

        expect(select)
            .toHaveBeenCalled();

    });
});


