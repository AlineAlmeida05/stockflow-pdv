import { Component, OnInit } from '@angular/core';
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

import { ProductSearch } from '../../shared/components/product-search/product-search';

@Component({
    selector: 'app-nova-venda',
    standalone: true,
    imports: [
        MainLayout,
        FormsModule,
        CurrencyPipe,
        PageTitle,
        EmptyState,
        ProductSearch
    ],
    templateUrl: './nova-venda.html',
    styleUrl: './nova-venda.scss'
})
export class NovaVenda implements OnInit {

    produtos: Produto[] = [];

    produtoSelecionadoId = '';

    quantidade: number | null = null;

    codigoBarras = '';

    carrinho: {
        produto: Produto;
        precoUnitario: number;
        quantidade: number;
        subtotal: number;
        promocaoAplicada?: boolean;
    }[] = [];

    formaPagamento:
        | 'pix'
        | 'dinheiro'
        | 'debito'
        | 'credito'
        | 'fiado'
        = 'dinheiro';

    clientes: Cliente[] = [];

    clienteSelecionadoId = '';

    valorRecebido: number | null = null;

    constructor(
        private produtoService: ProdutoService,
        private vendaService: VendaService,
        private movimentacaoService: MovimentacaoEstoqueService,
        private clienteService: ClienteService,
        private fiadoService: FiadoService
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

    carregarProdutos(): void {

        this.produtos =
            this.produtoService.listar();

    }

    carregarClientes(): void {

        this.clientes =
            this.clienteService.listar();

    }

    adicionarAoCarrinho(): void {

        if (
            this.quantidade === null ||
            this.quantidade <= 0
        ) {
            return;
        }

        const quantidade =

            this.quantidade ?? 0;

        const produto =
            this.produtos.find(
                p => p.id === this.produtoSelecionadoId
            );

        if (!produto) {
            return;
        }

        const itemExistente =
            this.carrinho.find(
                item => item.produto.id === produto.id
            );

        const quantidadeTotal =
            (itemExistente?.quantidade ?? 0) +
            quantidade;

        if (
            quantidadeTotal >
            produto.estoqueAtual
        ) {

            alert(
                'Quantidade maior que o estoque disponível.'
            );

            return;

        }
        const precoAplicado =
            produto.promocaoAtiva
                ? produto.precoPromocional!
                : produto.precoVenda;

        const subtotal =
            precoAplicado *
            quantidade;

        if (itemExistente) {

            itemExistente.quantidade =
                quantidadeTotal;

            itemExistente.precoUnitario =
                precoAplicado;

            itemExistente.promocaoAplicada =
                produto.promocaoAtiva;

            itemExistente.subtotal =
                itemExistente.quantidade *
                precoAplicado;

        } else {

            this.carrinho.push({

                produto,
                precoUnitario: precoAplicado,
                promocaoAplicada:
                    produto.promocaoAtiva,
                quantidade: quantidade,
                subtotal

            });

        }

        this.codigoBarras = '';

        this.produtoSelecionadoId = '';

        this.quantidade = null;

    }

    removerItem(produtoId: string): void {

        this.carrinho =
            this.carrinho.filter(
                item => item.produto.id !== produtoId
            );

    }

    buscarProdutoPorCodigo(): void {

        const produto =
            this.produtos.find(
                p =>
                    p.codigoBarras ===
                    this.codigoBarras.trim()
            );

        if (!produto) {
            return;
        }

        this.produtoSelecionadoId =
            produto.id;

    }

    finalizarVenda(): void {
        if (
            this.formaPagamento === 'dinheiro'
        ) {

            if (
                this.valorRecebido === null ||
                this.valorRecebido < this.total
            ) {

                alert(
                    'Valor recebido insuficiente.'
                );

                return;

            }

        }
        if (
            this.formaPagamento === 'fiado' &&
            !this.clienteSelecionadoId
        ) {

            alert(
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

            dataVenda:
                new Date().toISOString(),

            formaPagamento:
                this.formaPagamento,

            valorTotal: this.total,

            quantidadeItens:
                this.quantidadeTotalItens,

            clienteId:
                clienteSelecionado?.id,

            clienteNome:
                clienteSelecionado?.nome,

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

        this.carrinho = [];

        this.formaPagamento = 'dinheiro';

        this.codigoBarras = '';

        this.produtoSelecionadoId = '';

        this.quantidade = null;

        this.valorRecebido = null;

        alert(
            'Venda finalizada com sucesso!'
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

        this.produtoSelecionadoId =
            produto.id;

    }
}
