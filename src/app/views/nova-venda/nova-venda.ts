import {
    Component,
    OnInit,
    ViewChild,
    ElementRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { VendaService } from '../../core/services/venda.service';
import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';

import { Venda } from '../../core/models/venda.model';
import { ItemVenda } from '../../core/models/item-venda.model';
import { MovimentacaoEstoque } from '../../core/models/movimentacao-estoque.model';

import { Cliente } from '../../core/models/cliente.model';

import { ClienteService } from '../../core/services/cliente.service';
import { FiadoService } from '../../core/services/fiado.service';

import { CurrencyPipe } from '@angular/common';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

import { AlertService } from '../../core/services/alert.service';
import { ProductSelector } from '../../shared/components/product-selector/product-selector';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { DataTable } from '../../shared/components/data-table/data-table';
import { HostListener } from '@angular/core';
import { CurrencyInput } from '../../shared/components/currency-input/currency-input';

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
                align: 'right'
            },
            {
                field: 'valorUnitario',
                header: 'Unit.',
                type: 'currency',
                align: 'right'
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
                align: 'right'
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
        private movimentacaoService: MovimentacaoEstoqueService,
        private clienteService: ClienteService,
        private fiadoService: FiadoService,
        private alertService: AlertService
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

        this.produtos =
            this.produtoService.listar();

    }

    carregarClientes(): void {

        this.clientes =
            this.clienteService.listar();

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

        if (!this.formaPagamento) {

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
        if (
            this.formaPagamento === 'fiado' &&
            !this.clienteSelecionadoId
        ) {

            this.alertService.warning(
                'Selecione um cliente.'
            );

            return;

        }

        if (this.carrinho.length === 0) {
            return;
        }

        const clienteSelecionado =
            this.clientes.find(
                cliente =>
                    cliente.id === this.clienteSelecionadoId
            );

        const itensVenda: ItemVenda[] =
            this.carrinho.map(item => ({
                produtoId: item.produto.id,
                produtoNome: item.produto.nome,
                quantidade: item.quantidade,
                valorUnitario: item.precoUnitario,
                subtotal: item.subtotal,
                promocaoAplicada:
                    item.promocaoAplicada
            }));

        const venda: Venda = {

            id: crypto.randomUUID(),

            dataVenda: new Date().toISOString(),

            formaPagamento: this.formaPagamento,

            valorTotal: this.total,

            quantidadeItens: this.quantidadeTotalItens,

            clienteId: clienteSelecionado?.id,

            clienteNome: clienteSelecionado?.nome,

            status: 'finalizada',

            itens: itensVenda

        };

        this.vendaService.salvar(venda);

        if (
            this.formaPagamento === 'fiado' &&
            clienteSelecionado
        ) {

            this.fiadoService.salvar({

                id: crypto.randomUUID(),

                clienteId:
                    clienteSelecionado.id,

                clienteNome:
                    clienteSelecionado.nome,

                vendaId:
                    venda.id,

                valorTotal:
                    this.total,

                dataLancamento:
                    new Date().toISOString(),

                status: 'pendente'

            });

        }

        if (
            this.formaPagamento === 'dinheiro' &&
            this.valorRecebido !== null &&
            this.valorRecebido < this.total
        ) {

            this.alertService.warning(
                'O valor recebido é menor que o total da venda.'
            );

            return;

        }

        if (
            this.formaPagamento === 'dinheiro' &&
            this.valorRecebido !== null &&
            this.valorRecebido < this.total
        ) {

            this.alertService.warning(

                `Valor insuficiente.
Total da venda: ${this.total.toLocaleString(
                    'pt-BR',
                    {
                        style: 'currency',
                        currency: 'BRL'
                    }
                )}`

            );

            return;

        }

        for (const item of this.carrinho) {

            const produto =
                this.produtoService.buscarPorId(
                    item.produto.id
                );

            if (!produto) {
                continue;
            }

            produto.estoqueAtual -=
                item.quantidade;

            this.produtoService.atualizar(
                produto
            );

            const movimentacao: MovimentacaoEstoque = {

                id: crypto.randomUUID(),

                produtoId: produto.id,

                produtoNome: produto.nome,

                tipo: 'saida',

                quantidade: item.quantidade,

                precoCompra: 0,

                dataMovimentacao:
                    new Date().toISOString()

            };

            this.movimentacaoService.registrarSaida(
                movimentacao
            );

        }

        this.alertService.success(

            `Venda concluída com sucesso.

                Total:
                ${this.total.toLocaleString(
                'pt-BR',
                {
                    style: 'currency',
                    currency: 'BRL'
                }
            )}

                Itens:
                ${this.quantidadeItens}

                Pagamento:
                ${this.formaPagamento}`

        );

        this.carrinho = [];

        this.formaPagamento = 'Selecione...';

        this.produtoSelecionadoId = '';

        this.quantidade = null;

        this.valorRecebido = null;

        this.productSelector?.limpar();


        this.carregarProdutos();

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

                valorUnitario: `R$ ${item.precoUnitario.toFixed(2)}`,

                subtotal: `R$ ${item.subtotal.toFixed(2)}`,

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

}
