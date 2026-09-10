import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { VendaService } from '../../core/services/venda.service';
import { Cliente } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/cliente.service';
import { CurrencyPipe } from '@angular/common';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { AlertService } from '../../core/services/alert.service';
import { ProductSelector } from '../../shared/components/product-selector/product-selector';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { DataTable } from '../../shared/components/data-table/data-table';
import { HostListener } from '@angular/core';
import { CurrencyInput } from '../../shared/components/currency-input/currency-input';
import { ClienteResumo } from '../../core/models/cliente-resumo.model';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
    selector: 'app-nova-venda',
    standalone: true,
    imports: [
        MainLayout,
        FormsModule,
        CurrencyPipe,
        PageTitle,
        EmptyState,
        ProductSelector,
        SplitPanel,
        DataTable,
        CurrencyInput
    ],
    templateUrl: './nova-venda.html',
    styleUrl: './nova-venda.scss'
})
export class NovaVenda implements OnInit {

    produtos: Produto[] = [];

    produtoSelecionadoId = '';

    quantidade: number | null = null;

    resumoCliente?: ClienteResumo;

    carrinho: {
        produto: Produto;
        precoUnitario: number;
        quantidade: number;
        subtotal: number;
        promocaoAplicada?: boolean;
    }[] = [];

    formaPagamento:
        | 'Selecione...'
        | 'pix'
        | 'dinheiro'
        | 'debito'
        | 'credito'
        | 'fiado'
        = 'Selecione...';

    clientes: Cliente[] = [];

    clienteSelecionadoId = '';

    valorRecebido: number | null = null;

    adicionandoItem = false;

    finalizandoVenda = false;

    colunasCarrinho: {
        field: string;
        header: string;
        type?: | 'text' | 'badge' | 'currency' | 'date';
        align?: 'left' | 'right' | 'center';
    }[] = [
            {
                field: 'produtoNome',
                header: 'Produto'
            },
            {
                field: 'quantidade',
                header: 'Qtde',
                align: 'center'
            },
            {
                field: 'valorUnitario',
                header: 'Unit.',
                type: 'currency',
                align: 'center'
            },
            {
                field: 'desconto',
                header: 'Promoção',
                type: 'currency',
                align: 'center'
            },
            {
                field: 'subtotal',
                header: 'Subtotal',
                type: 'currency',
                align: 'center'
            },
            {
                field: 'acoes',
                header: '',
                align: 'center'
            },
        ];

    @ViewChild(ProductSelector)
    productSelector?: ProductSelector;

    @ViewChild('quantidadeInput')
    quantidadeInput?: ElementRef<HTMLInputElement>;

    @ViewChild('formaPagamentoSelect')
    formaPagamentoSelect?: ElementRef<HTMLSelectElement>;

    constructor(
        private produtoService: ProdutoService,
        private vendaService: VendaService,
        private clienteService: ClienteService,
        private alertService: AlertService,
        private confirmDialogService: ConfirmDialogService
    ) { }

    ngOnInit(): void {
        this.carregarProdutos();

        this.carregarClientes();
    }

    get total(): number {

        return Number(
            this.carrinho
                .reduce(
                    (total, item) =>
                        total + item.subtotal,
                    0
                )
                .toFixed(2)
        );

    }

    get quantidadeTotalItens(): number {

        return this.carrinho.reduce(
            (total, item) =>
                total + item.quantidade,
            0
        );

    }

    get produtoSelecionado(): Produto | undefined {

        return this.produtos.find(
            produto => produto.id === this.produtoSelecionadoId
        );

    }

    get statusEstoque(): 'alto' | 'medio' | 'baixo' {

        if (!this.produtoSelecionado) {

            return 'alto';

        }

        if (
            this.produtoSelecionado.estoqueAtual <= 5
        ) {

            return 'baixo';

        }

        if (
            this.produtoSelecionado.estoqueAtual <= 10
        ) {

            return 'medio';

        }

        return 'alto';

    }

    carregarProdutos(): void {

        this.produtoService
            .listar()
            .subscribe({

                next: produtos => {

                    this.produtos = produtos;

                },

                error: erro => {

                    console.error(erro);

                }

            });

    }

    carregarClientes(): void {

        this.clienteService
            .listar()
            .subscribe({

                next: clientes => {

                    this.clientes =
                        clientes;

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    adicionarAoCarrinho(): void {

        if (this.adicionandoItem) {

            return;

        }

        this.adicionandoItem = true;

        try {

            if (!this.produtoSelecionadoId) {

                this.alertService.warning(
                    'Selecione um produto.'
                );

                return;
            }

            if (
                this.quantidade === null ||
                this.quantidade <= 0
            ) {

                this.alertService.warning(
                    'Informe uma quantidade válida.'
                );

                return;

            }

            const produto =
                this.produtos.find(
                    p => p.id === this.produtoSelecionadoId
                );

            if (!produto) {

                return;

            }
            if (!produto.ativo) {

                this.alertService.warning(
                    'Produto inativo.'
                );

                return;

            }

            const itemExistente =
                this.carrinho.find(
                    item =>
                        item.produto.id === produto.id
                );

            const quantidadeTotal =
                (itemExistente?.quantidade ?? 0) +
                this.quantidade;

            if (
                quantidadeTotal >
                produto.estoqueAtual
            ) {

                this.alertService.warning(

                    `Estoque insuficiente. Disponível: ${produto.estoqueAtual} unidade(s).`

                );

                return;

            }

            const precoAplicado =
                produto.promocaoAtiva
                    ? produto.precoPromocional!
                    : produto.precoVenda;

            if (itemExistente) {

                itemExistente.quantidade = quantidadeTotal;

                itemExistente.precoUnitario = precoAplicado;

                itemExistente.promocaoAplicada = produto.promocaoAtiva;

                itemExistente.subtotal = quantidadeTotal *
                    precoAplicado;

            } else {

                this.carrinho.push({

                    produto,

                    precoUnitario: precoAplicado,

                    quantidade: this.quantidade,

                    subtotal: this.quantidade * precoAplicado,

                    promocaoAplicada: produto.promocaoAtiva

                });

            }

            this.quantidade = null;

            this.produtoSelecionadoId = '';

            this.productSelector?.limpar();

        } finally {

            this.adicionandoItem = false;
        }
    }

    removerItem(produtoId: string): void {

        this.carrinho =
            this.carrinho.filter(
                item => item.produto.id !== produtoId
            );

    }

    finalizarVenda(): void {

        if (this.finalizandoVenda) {
            return;
        }

        this.finalizandoVenda = true;

        if (
            !this.formaPagamento
            ||
            this.formaPagamento === 'Selecione...'
        ) {

            this.finalizandoVenda = false;

            this.alertService.warning(
                'Selecione uma forma de pagamento.'
            );

            return;
        }
        if (
            this.formaPagamento === 'dinheiro'
        ) {

            if (
                this.valorRecebido === null ||
                this.valorRecebido < this.total
            ) {

                this.alertService.warning(
                    'Valor recebido insuficiente.'
                );

                return;
            }
        }

        if (this.carrinho.length === 0) {

            this.finalizandoVenda = false;

            return;
        }
        if (
            this.formaPagamento === 'fiado'
            &&
            this.resumoCliente
        ) {

            const saldoAtual =
                this.resumoCliente.saldoDevedor;

            const limite =
                this.resumoCliente.limiteCredito;

            const novaDivida =
                saldoAtual + this.total;

            if (saldoAtual > limite) {

                this.finalizandoVenda = false;

                this.confirmarLimiteJaExcedido(
                    novaDivida
                );

                return;
            }

            if (novaDivida > limite) {

                this.finalizandoVenda = false;

                this.confirmarLimiteExcedido(
                    novaDivida
                );

                return;
            }
        }
        this.salvarVenda();


    }

    get troco(): number {

        if (
            this.formaPagamento !== 'dinheiro'
        ) {
            return 0;
        }

        return Math.max(
            0,
            (this.valorRecebido ?? 0) - this.total
        );

    }

    selecionarProduto(
        produto: Produto
    ): void {
        if (!produto.ativo) {

            this.alertService.warning(
                'Produto inativo.'
            );

            return;

        }
        if (produto.estoqueAtual <= 0) {

            this.alertService.warning(
                'Produto sem estoque disponível.'
            );
            return;
        }

        this.produtoSelecionadoId =
            produto.id;

        this.focarQuantidade();

    }

    get carrinhoTabela() {

        return this.carrinho.map(
            item => ({

                produtoId: item.produto.id,

                produtoNome: item.produto.nome,

                quantidade: item.quantidade,

                valorUnitario: item.precoUnitario,

                subtotal: item.subtotal,

                promocao: item.promocaoAplicada ? 'Promoção' : '',

                desconto:
                    item.promocaoAplicada
                        ? `${Math.round(
                            (
                                (item.produto.precoVenda -
                                    item.precoUnitario)
                                /
                                item.produto.precoVenda
                            ) * 100
                        )}% (R$ ${(
                            (item.produto.precoVenda -
                                item.precoUnitario)
                            * item.quantidade
                        ).toFixed(2)})`
                        : '-'

            })
        );

    }

    removerItemCarrinho(
        row: unknown
    ): void {

        const confirmar = confirm(
            'Deseja remover este item do carrinho?'
        );

        if (!confirmar) {

            return;

        }

        const item =
            row as {
                produtoId: string;
            };

        this.removerItem(
            item.produtoId
        );

    }

    focarQuantidade(): void {

        queueMicrotask(() => {

            this.quantidadeInput
                ?.nativeElement
                .focus();

        });

    }

    get indicadorEstoque(): 'alto' | 'medio' | 'baixo' {

        if (!this.produtoSelecionado) {

            return 'alto';

        }

        if (
            this.produtoSelecionado.estoqueAtual <= 5
        ) {

            return 'baixo';

        }

        if (
            this.produtoSelecionado.estoqueAtual <= 10
        ) {

            return 'medio';

        }

        return 'alto';

    }

    get totalDescontos(): number {

        return this.carrinho.reduce(
            (total, item) => {

                if (!item.promocaoAplicada) {

                    return total;

                }

                return total + (
                    (item.produto.precoVenda -
                        item.precoUnitario)
                    * item.quantidade
                );

            },
            0
        );

    }

    @HostListener('document:keydown', ['$event']) onKeyDown(
        event: KeyboardEvent
    ): void {

        if (event.key === 'F4') {

            event.preventDefault();

            this.focarPagamento();

            return;

        }


        if (event.key === 'Escape') {

            this.productSelector?.limpar();

            this.produtoSelecionadoId = '';

            return;

        }

        if (event.key === 'F2') {

            event.preventDefault();

            if (this.carrinho.length === 0) {

                this.finalizandoVenda = false;

                return;

            }

            this.finalizarVenda();

        }

    }

    get quantidadeItens(): number {

        return this.carrinho.reduce(
            (total, item) =>
                total + item.quantidade,
            0
        );

    }

    focarPagamento(): void {

        this.formaPagamentoSelect
            ?.nativeElement
            .focus();

    }

    carregarResumoCliente(): void {

        if (!this.clienteSelecionadoId) {

            this.resumoCliente = undefined;

            return;
        }

        this.clienteService
            .obterResumo(
                this.clienteSelecionadoId
            )
            .subscribe({

                next: resumo => {

                    this.resumoCliente =
                        resumo;

                },

                error: erro => {

                    console.error(
                        erro
                    );
                }

            });
    }

    private confirmarLimiteExcedido(
        novaDivida: number
    ): void {

        this.confirmDialogService.open({

            title: 'Limite de Crédito',

            message:

                `O cliente ultrapassará o limite de crédito após esta venda.

                Limite: R$ ${this.resumoCliente?.limiteCredito.toFixed(2)}

                Dívida Atual: R$ ${this.resumoCliente?.saldoDevedor.toFixed(2)}

                Nova Dívida: R$ ${novaDivida.toFixed(2)}

                Deseja continuar a venda?`,

            type: 'warning',

            confirmText: 'Continuar',

            cancelText: 'Cancelar',



            onConfirm: () => {

                this.salvarVenda();
            }
        });
    }

    private confirmarLimiteJaExcedido(
        novaDivida: number
    ): void {

        this.confirmDialogService.open({

            title: 'Limite já excedido',

            message:

                `O cliente já está acima do limite de crédito.

                Limite: R$ ${this.resumoCliente?.limiteCredito.toFixed(2)}

                Saldo Atual: R$ ${this.resumoCliente?.saldoDevedor.toFixed(2)}

                Nova Dívida: R$ ${novaDivida.toFixed(2)}

                Deseja continuar a venda?`,

            type: 'warning',

            confirmText: 'Continuar',

            cancelText: 'Cancelar',

            onConfirm: () => {

                this.salvarVenda();
            }
        });
    }

    private salvarVenda(): void {
        const vendaRequest = {

            formaPagamento: this.formaPagamento,

            clienteId: this.clienteSelecionadoId || null,

            valorRecebido: this.valorRecebido,

            itens:
                this.carrinho.map(
                    item => ({

                        produtoId:
                            item.produto.id,

                        quantidade:
                            item.quantidade

                    })
                )
        };

        this.vendaService
            .salvar(vendaRequest)
            .subscribe({

                next: () => {

                    this.finalizandoVenda = false;

                    this.alertService.success(
                        'Venda concluída com sucesso.'
                    );

                    this.carrinho = [];

                    this.formaPagamento = 'Selecione...';

                    this.produtoSelecionadoId = '';

                    this.quantidade = null;

                    this.valorRecebido = null;

                    this.productSelector?.limpar();

                    this.carregarProdutos();

                    this.resumoCliente = undefined;
                    this.clienteSelecionadoId = '';

                },



                error: erro => {

                    this.finalizandoVenda = false;

                    console.error(
                        erro
                    );

                    this.alertService.error(

                        erro?.error?.message ||

                        'Erro ao finalizar venda.'

                    );

                }

            });
    }
}
