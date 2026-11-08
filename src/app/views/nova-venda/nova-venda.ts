import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { VendaService } from '../../core/services/venda.service';
import { Cliente } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/cliente.service';
import { CurrencyPipe } from '@angular/common';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { AlertService } from '../../core/services/alert.service';
import { HostListener } from '@angular/core';
import { CurrencyInput } from '../../shared/components/currency-input/currency-input';
import { ClienteResumo } from '../../core/models/cliente-resumo.model';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { SmartProductSearch } from '../../shared/components/smart-product-search/smart-product-search';
import { ItemCarrinho } from '../../core/models/item-carrinho.model';
import { VendaRequest, FormaPagamento } from '../../core/models/venda-request.model';
import { FORMA_PAGAMENTO_LABELS, FORMA_PAGAMENTO_PADRAO, FormaPagamentoTela } from '../../core/models/forma-pagamento.model';
import { StatusEstoque } from '../../core/models/estoque-status.model';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { VendaLinha } from '../../core/models/venda-linha.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nova-venda',
    standalone: true,
    imports: [
        MainLayout,
        FormsModule,
        CurrencyPipe,
        PageTitle,
        CurrencyInput,
        SmartProductSearch,
        SplitPanel
    ],
    templateUrl: './nova-venda.html',
    styleUrl: './nova-venda.scss'
})
export class NovaVenda implements OnInit, AfterViewInit {

    produtos: Produto[] = [];

    produtoSelecionadoId = '';

    quantidade: number | null = null;

    resumoCliente?: ClienteResumo;

    carrinho: ItemCarrinho[] = [];

    formaPagamento: FormaPagamentoTela = FORMA_PAGAMENTO_PADRAO;

    clientes: Cliente[] = [];

    clienteSelecionadoId = '';

    valorRecebido: number | null = null;

    adicionandoItem = false;

    finalizandoVenda = false;

    mostrarPagamento = false;

    mostrarDialogLimite = false;

    novoLimite: number | null = null;

    motivoAumentoLimite = '';

    linhasVenda: VendaLinha[] = [
        {
            id: crypto.randomUUID(),
            quantidade: 1
        }
    ];

    @ViewChild('produtoSearch', {
        read: SmartProductSearch
    })
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
        private cdr: ChangeDetectorRef,
        private router: Router
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

    get podeAumentarLimite(): boolean {

        return (
            !this.clienteInativo
            &&
            this.resumoCliente?.status !== 'Inadimplente'
            &&
            this.resumoCliente?.status !== 'Limite Excedido'
        );

    }

    abrirDialogAumentoLimite(): void {

        const limiteAtual = this.resumoCliente?.limiteCredito ?? 0;

        this.novoLimite = limiteAtual + 100;

        this.motivoAumentoLimite = '';

        this.mostrarDialogLimite = true;

    }

    get aumentoLimite(): number {

        return Math.max(
            0,
            (this.novoLimite ?? 0)
            -
            (this.resumoCliente?.limiteCredito ?? 0)
        );

    }

    validarAumentoLimite(): boolean {

        const limiteAtual = this.resumoCliente?.limiteCredito ?? 0;

        if (
            !this.novoLimite
        ) {

            this.alertService.warning(
                'Informe o novo limite.'
            );

            return false;

        }

        if (
            this.novoLimite <= limiteAtual
        ) {

            this.alertService.warning(
                'O novo limite deve ser maior que o atual.'
            );

            return false;

        }

        if (
            !this.motivoAumentoLimite.trim()
        ) {

            this.alertService.warning(
                'Informe o motivo do aumento.'
            );

            return false;

        }

        return true;

    }

    confirmarAumentoLimite(): void {

        if (
            !this.validarAumentoLimite()
        ) {

            return;

        }

        this.confirmDialogService.open({

            title: 'Aumentar Limite',

            message: `Deseja aumentar o limite deste cliente?

            Limite Atual:
            ${this.resumoCliente?.limiteCredito
                }

            Novo Limite:
            ${this.novoLimite
                }
            `,

            type: 'warning',

            confirmText: 'Confirmar',

            cancelText: 'Cancelar',

            onConfirm: () => {

                this.salvarAumentoLimite();

            }

        });

    }

    salvarAumentoLimite(): void {

        const cliente = this.obterClienteSelecionado();

        if (!cliente) {

            return;

        }

        const clienteAtualizado: Cliente = {

            ...cliente,

            limiteCredito:
                this.novoLimite!

        };

        this.clienteService
            .atualizar(
                clienteAtualizado
            )
            .subscribe({

                next: () => {

                    cliente.limiteCredito = this.novoLimite!;

                    this.alertService.success(
                        'Limite atualizado com sucesso.'
                    );

                    this.mostrarDialogLimite = false;

                    this.carregarClientes();

                    this.carregarResumoCliente();

                },

                error: (erro: unknown) => {

                    console.error(
                        erro
                    );

                    this.alertService.error(
                        'Erro ao atualizar limite.'
                    );

                }

            });

    }

    private obterClienteSelecionado(): Cliente | undefined {

        return this.clientes.find(
            cliente =>
                cliente.id === this.clienteSelecionadoId
        );

    }

    get produtoSelecionado(): Produto | undefined {

        return this.produtos.find(

            produto => produto.id === this.produtoSelecionadoId

        );

    }

    get statusEstoque(): StatusEstoque {

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

                    this.cdr.detectChanges();
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

                    this.clientes = clientes;

                    this.cdr.detectChanges();

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

            const produto = this.produtos.find(
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

            const itemExistente = this.carrinho.find(
                item =>
                    item.produto.id === produto.id
            );

            const quantidadeTotal = (itemExistente?.quantidade ?? 0) + this.quantidade;

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
                this.obterPrecoAplicado(
                    produto
                );

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

            this.resetLinhaVenda();

        } finally {

            this.adicionandoItem = false;
        }
    }

    removerItem(produtoId: string): void {

        this.carrinho = this.carrinho.filter(
            item => item.produto.id !== produtoId
        );

    }

    finalizarVenda(): void {

        if (this.finalizandoVenda) {
            return;
        }

        this.finalizandoVenda = true;

        if (!this.validarVenda()) {
            return;
        }

        this.salvarVenda();
    }

    private validarVenda(): boolean {

        if (
            !this.formaPagamento ||
            this.formaPagamento === 'Selecione...'
        ) {

            this.finalizandoVenda = false;

            this.alertService.warning(
                'Selecione uma forma de pagamento.'
            );

            return false;
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

                return false;
            }
        }

        if (this.carrinho.length === 0) {

            this.finalizandoVenda = false;

            return false;
        }

        if (
            this.formaPagamento === 'fiado'
            && !this.clienteSelecionadoId
        ) {

            this.finalizandoVenda = false;

            this.alertService.warning(
                'Selecione um cliente para vender fiado.'
            );

            return false;
        }

        if (
            this.formaPagamento === 'fiado'
            && this.resumoCliente?.status === 'Inadimplente'
        ) {

            this.finalizandoVenda = false;

            this.alertService.error(
                'Cliente inadimplente. Venda fiado não permitida.'
            );

            return false;
        }

        if (
            this.formaPagamento === 'fiado'
            && this.resumoCliente
            && this.total >
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

            return false;
        }

        return true;
    }

    get clienteBloqueadoFiado(): boolean {

        const cliente =
            this.clientes.find(
                c => c.id === this.clienteSelecionadoId
            );

        return (
            this.formaPagamento === 'fiado'
            &&
            (
                cliente?.ativo === false
                ||
                this.resumoCliente?.status === 'Inadimplente'
                ||
                this.resumoCliente?.status === 'Limite Excedido'
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
                'Este produto está inativo.'
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

    focarQuantidade(): void {

        setTimeout(() => {

            this.quantidadeInput?.nativeElement
                .focus();

            this.quantidadeInput?.nativeElement
                .select();

        });

    }

    get totalDescontos(): number {

        return this.carrinho.reduce(
            (total, item) => {

                if (!item.promocaoAplicada) {

                    return total;

                }

                return total + (
                    (item.produto.precoVenda -
                        item.precoUnitario) * item.quantidade
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

            this.abrirPagamento();

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

            this.focarProduto();

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

        this.formaPagamentoSelect?.nativeElement
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

                    this.resumoCliente = resumo;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );
                }

            });
    }

    private salvarVenda(): void {

        const vendaRequest = this.criarVendaRequest();

        this.vendaService
            .salvar(vendaRequest)
            .subscribe({

                next: () => {

                    this.finalizandoVenda = false;

                    this.alertService.success(
                        'Venda concluída com sucesso.'
                    );

                    this.limparVenda();

                    this.carregarProdutos();

                    this.focarProduto();

                    this.cdr.detectChanges();
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

        if (
            this.formaPagamento === FORMA_PAGAMENTO_PADRAO
        ) {

            return 'Não informado';
        }

        return FORMA_PAGAMENTO_LABELS[
            this.formaPagamento
        ];
    }

    ngAfterViewInit(): void {

        setTimeout(() => {

            this.focarProduto();

        });

    }

    private obterPrecoAplicado(
        produto: Produto
    ): number {

        return produto.promocaoAtiva
            ? produto.precoPromocional!
            : produto.precoVenda;
    }

    private criarVendaRequest(): VendaRequest {

        return {

            formaPagamento: this.formaPagamento as FormaPagamento,

            clienteId: this.clienteSelecionadoId || null,

            valorRecebido: this.valorRecebido,

            itens: this.carrinho.map(
                item => ({

                    produtoId: item.produto.id,

                    quantidade: item.quantidade
                })
            )
        };
    }

    private limparVenda(): void {

        this.carrinho = [];

        this.mostrarPagamento = false;

        this.formaPagamento = FORMA_PAGAMENTO_PADRAO;

        this.produtoSelecionadoId = '';

        this.quantidade = null;

        this.valorRecebido = null;

        this.limparCliente();

        this.smartProductSearch?.limpar();
    }

    private focarProduto(): void {

        this.smartProductSearch?.focar();
    }

    private limparCliente(): void {

        this.resumoCliente = undefined;

        this.clienteSelecionadoId = '';
    }

    get quantidadePromocoes(): number {

        return this.carrinho.filter(
            item => item.promocaoAplicada
        ).length;

    }

    adicionarLinha(): void {

        this.linhasVenda.push({
            id: crypto.randomUUID(),
            quantidade: 1
        });

    }

    removerLinha(
        id: string
    ): void {

        this.linhasVenda =
            this.linhasVenda.filter(
                linha => linha.id !== id
            );

    }

    incrementarQuantidadeCarrinho(
        item: ItemCarrinho
    ): void {

        if (
            item.quantidade >=
            item.produto.estoqueAtual
        ) {

            this.alertService.warning(
                'Estoque insuficiente.'
            );

            return;
        }

        item.quantidade++;

        item.subtotal =
            item.quantidade *
            item.precoUnitario;

    }

    decrementarQuantidadeCarrinho(
        item: ItemCarrinho
    ): void {

        if (
            item.quantidade <= 1
        ) {

            this.removerItem(
                item.produto.id
            );

            return;
        }

        item.quantidade--;

        item.subtotal =
            item.quantidade *
            item.precoUnitario;

    }

    get precoLinhaAtual(): number {

        if (!this.produtoSelecionado) {
            return 0;
        }

        return this.produtoSelecionado.promocaoAtiva
            ? this.produtoSelecionado.precoPromocional!
            : this.produtoSelecionado.precoVenda;

    }

    get subtotalLinhaAtual(): number {

        if (
            !this.produtoSelecionado ||
            !this.quantidade
        ) {
            return 0;
        }

        return this.precoLinhaAtual * this.quantidade;

    }

    private resetLinhaVenda(): void {

        this.quantidade = null;

        this.produtoSelecionadoId = '';

        setTimeout(() => {

            this.smartProductSearch?.limpar();

            this.smartProductSearch?.focar();

        }, 50);

    }

    abrirPagamento(): void {

        if (this.carrinho.length === 0) {

            this.alertService.warning(
                'Adicione pelo menos um item ao carrinho.'
            );

            return;

        }

        this.mostrarPagamento = true;

        setTimeout(() => {

            this.focarPagamento();

        });

    }

    get clienteInativo(): boolean {

        const cliente = this.clientes.find(
            c => c.id === this.clienteSelecionadoId
        );

        return cliente?.ativo === false;

    }

    abrirHistorico(): void {

        this.router.navigate(
            ['/historico-de-vendas']
        );

    }

    selecionarCliente(clienteId: string): void {

        this.clienteSelecionadoId = clienteId;

        this.resumoCliente = undefined;

        this.carregarResumoCliente();

    }

}
