import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardapioProduto } from '../../core/models/cardapio-produto.model';
import { DeliveryService } from '../../core/services/delivery.service';
import { ItemCarrinhoDelivery } from '../../core/models/item-carrinho-delivery.model';
import { TenantContextService } from '../../core/services/tenant-context.service';

@Component({
    selector: 'app-delivery-catalogo',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule
    ],
    templateUrl: './delivery-catalogo.html',
    styleUrl: './delivery-catalogo.scss'
})
export class DeliveryCatalogo implements OnInit {

    produtos: CardapioProduto[] = [];

    textoBusca = '';

    carrinho: ItemCarrinhoDelivery[] = [];

    mostrarCheckout = false;

    clienteNome = '';

    telefone = '';

    endereco = '';

    complemento = '';

    observacao = '';

    formaPagamento = 'PIX';

    pedidoCriado = false;

    constructor(
        private deliveryService: DeliveryService,
        private cdr: ChangeDetectorRef,
        private tenantContextService: TenantContextService
    ) { }

    ngOnInit(): void {

        this.carregarCardapio();

    }

    carregarCardapio(): void {

        this.deliveryService
            .listarCardapio(
                this.slugTenant
            )

            .subscribe({

                next: response => {

                    console.log('CARDAPIO', response);

                    this.produtos = response;

                    this.cdr.detectChanges();

                }

            });

    }

    get produtosFiltrados():
        CardapioProduto[] {

        const busca =
            this.textoBusca
                .toLowerCase();

        return this.produtos.filter(
            produto =>
                produto.nome
                    .toLowerCase()
                    .includes(busca)
                ||
                produto.categoria
                    .toLowerCase()
                    .includes(busca)
        );

    }

    adicionarProduto(
        produto: CardapioProduto
    ): void {

        const itemExistente =
            this.carrinho.find(
                item =>
                    item.produto.id === produto.id
            );

        if (itemExistente) {

            itemExistente.quantidade++;

            return;

        }

        this.carrinho.push({

            produto,

            quantidade: 1

        });

    }

    get totalItens(): number {

        return this.carrinho.reduce(

            (total, item) =>
                total + item.quantidade,

            0

        );

    }

    get valorTotal(): number {

        return this.carrinho.reduce(

            (total, item) =>

                total +

                (
                    item.produto.preco
                    *
                    item.quantidade
                ),

            0

        );

    }

    get categorias(): string[] {

        return [
            ...new Set(
                this.produtosFiltrados.map(
                    produto => produto.categoria
                )
            )
        ].sort();

    }

    obterProdutosCategoria(
        categoria: string
    ): CardapioProduto[] {

        return this.produtosFiltrados.filter(
            produto =>
                produto.categoria === categoria
        );

    }

    abrirCheckout(): void {

        this.mostrarCheckout = true;

    }

    confirmarPedido(): void {

        const request = {

            clienteNome: this.clienteNome,

            telefone: this.telefone,

            endereco: this.endereco,

            complemento: this.complemento,

            observacao: this.observacao,

            formaPagamento: this.formaPagamento,

            itens:

                this.carrinho.map(
                    item => ({

                        produtoId: item.produto.id,

                        quantidade: item.quantidade

                    })
                )

        };

        this.deliveryService
            .criarPedido(
                this.slugTenant,
                request
            )
            .subscribe({

                next: response => {

                    this.carrinho = [];

                    this.mostrarCheckout = false;

                    this.clienteNome = '';

                    this.telefone = '';

                    this.endereco = '';

                    this.complemento = '';

                    this.observacao = '';

                    this.formaPagamento = 'PIX';

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        'ERRO PEDIDO',
                        erro
                    );

                }

            });

    }

    incrementarQuantidade(
        produtoId: string
    ): void {

        const item =
            this.carrinho.find(
                item =>
                    item.produto.id === produtoId
            );

        if (item) {

            item.quantidade++;

        }

    }

    decrementarQuantidade(
        produtoId: string
    ): void {

        const item =
            this.carrinho.find(
                item =>
                    item.produto.id === produtoId
            );

        if (!item) {
            return;
        }

        item.quantidade--;

        this.carrinho =
            this.carrinho.filter(
                item =>
                    item.quantidade > 0
            );

    }

    get slugTenant(): string {

        return this
            .tenantContextService
            .tenantAtual
            ?.slug
            ?? 'stockflowpdv';

    }


}