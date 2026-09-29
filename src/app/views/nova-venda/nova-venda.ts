import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { DataTable } from '../../shared/components/data-table/data-table';
import { HostListener } from '@angular/core';
import { CurrencyInput } from '../../shared/components/currency-input/currency-input';
import { ClienteResumo } from '../../core/models/cliente-resumo.model';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { SmartProductSearch } from '../../shared/components/smart-product-search/smart-product-search';

@Component({
    selector: 'app-nova-venda',
    standalone: true,
    imports: [
        MainLayout,
        FormsModule,
        CurrencyPipe,
        PageTitle,
        EmptyState,
        DataTable,
        CurrencyInput,
        SmartProductSearch
    ],
    templateUrl: './nova-venda.html',
    styleUrl: './nova-venda.scss'
})
export class NovaVenda implements OnInit, AfterViewInit {

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
                field: 'precoVenda',
                header: 'Unit.',
                type: 'currency',
                align: 'center'
            },
            {
                field: 'precoPromocional',
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

    @ViewChild(SmartProductSearch)
    smartProductSearch?: SmartProductSearch;

    @ViewChild('quantidadeInput')
    quantidadeInput?: ElementRef<HTMLInputElement>;

    @ViewChild('formaPagamentoSelect')
    formaPagamentoSelect?: ElementRef<HTMLSelectElement>;

    constructor(
        private produtoService: ProdutoService,
        private vendaService: VendaService,
        private clienteService: ClienteService,
        private alertService: AlertService,
        private confirmDialogService: ConfirmDialogService,
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
                itemExistente.subtotal = quantidadeTotal * precoAplicado;

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
            this.smartProductSearch?.limpar();

            setTimeout(() => {

                this.smartProductSearch?.focar();

            });

        } finally {

            this.adicionandoItem = false;
        }

        console.log(this.carrinho);
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

                this.finalizandoVenda = false;

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
            this.formaPagamento === 'fiado' &&
            !this.clienteSelecionadoId
        ) {

            this.finalizandoVenda = false;

            this.alertService.warning(
                'Selecione um cliente para venda fiado.'
            );

            return;

        }

        if (
            this.formaPagamento === 'fiado' &&
            this.resumoCliente?.status === 'Inadimplente'
        ) {

            this.finalizandoVenda = false;

            this.alertService.error(
                'Cliente inadimplente. Venda fiado não permitida.'
            );

            return;

        }

        if (
            this.formaPagamento === 'fiado' &&
            this.resumoCliente &&
            this.total >
            this.resumoCliente.creditoDisponivel
        ) {

            this.finalizandoVenda = false;

            this.alertService.error(
                `Limite de crédito insuficiente.
        Disponível: ${this.resumoCliente.creditoDisponivel
                    .toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL'
                        }
                    )
                }`
            );

            return;

        }

        console.log('Passou nas validações');

        this.salvarVenda();


    }

    get clienteBloqueadoFiado(): boolean {

        return (
            this.formaPagamento === 'fiado'
            &&
            !!this.resumoCliente
            &&
            (
                this.resumoCliente.status === 'Inadimplente'
                ||
                this.resumoCliente.status === 'Limite Excedido'
            )
        );

    }

    get creditoInsuficiente(): boolean {

        return (
            this.formaPagamento === 'fiado'
            &&
            !!this.resumoCliente
            &&
            this.total >
            this.resumoCliente.creditoDisponivel
        );

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

        this.produtoSelecionadoId = produto.id;

        this.quantidade = 1;

        this.focarQuantidade();

    }

    get carrinhoTabela() {

        return this.carrinho.map(
            item => ({

                produtoId: item.produto.id,

                produtoNome: item.produto.nome,

                quantidade: item.quantidade,

                precoVenda: item.produto.precoVenda,

                precoPromocional:
                    item.promocaoAplicada
                        ? item.precoUnitario
                        : 0,

                subtotal: item.subtotal

            })
        );

    }

    removerItemCarrinho(
        row: unknown
    ): void {

        const item =
            row as {
                produtoId: string;
                produtoNome: string;
            };

        this.confirmDialogService.open({

            title: 'Remover Item',

            message:
                `Deseja remover "${item.produtoNome}" do carrinho?`,

            type: 'danger',

            confirmText: 'Remover',

            cancelText: 'Cancelar',

            onConfirm: () => {

                this.removerItem(
                    item.produtoId
                );

                this.alertService.success(
                    `"${item.produtoNome}" removido do carrinho.`
                );

            }

        });

    }

    focarQuantidade(): void {

        setTimeout(() => {

            this.quantidadeInput
                ?.nativeElement
                .focus();

            this.quantidadeInput
                ?.nativeElement
                .select();

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

            this.smartProductSearch?.limpar();

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

        if (event.key === 'F3') {

            event.preventDefault();

            this.smartProductSearch?.focar();

            return;
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

                    this.smartProductSearch?.limpar();

                    this.carregarProdutos();

                    this.resumoCliente = undefined;
                    this.clienteSelecionadoId = '';

                    this.smartProductSearch?.focar();

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

    get formaPagamentoDescricao(): string {

        switch (this.formaPagamento) {

            case 'pix':
                return 'PIX';

            case 'dinheiro':
                return 'Dinheiro';

            case 'debito':
                return 'Débito';

            case 'credito':
                return 'Crédito';

            case 'fiado':
                return 'Fiado';

            default:
                return 'Não informado';

        }

    }

    ngAfterViewInit(): void {

        setTimeout(() => {

            this.smartProductSearch?.focar();

        });

    }
}
