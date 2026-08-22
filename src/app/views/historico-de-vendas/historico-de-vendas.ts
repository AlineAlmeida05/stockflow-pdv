import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Venda } from '../../core/models/venda.model';

import { VendaService } from '../../core/services/venda.service';

import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../core/services/produto.service';
import { FiadoService } from '../../core/services/fiado.service';
import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';

import { MovimentacaoEstoque } from '../../core/models/movimentacao-estoque.model';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';

@Component({
    selector: 'app-historico-de-vendas',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        DatePipe,
        FormsModule,
        PageTitle,
        EmptyState,
        StatCard,
        SplitPanel

    ],
    templateUrl: './historico-de-vendas.html',
    styleUrl: './historico-de-vendas.scss'
})

export class HistoricoDeVendas
    implements OnInit {

    vendas: Venda[] = [];

    vendaSelecionada?: Venda;

    filtroPagamento = '';

    mostrarCancelamento = false;

    motivoCancelamento = '';

    textoBusca = '';

    constructor(
        private vendaService: VendaService,
        private produtoService: ProdutoService,
        private fiadoService: FiadoService,
        private movimentacaoService:
            MovimentacaoEstoqueService
    ) { }

    ngOnInit(): void {

        this.vendas =
            this.vendaService
                .listar()
                .sort(
                    (a, b) =>
                        new Date(b.dataVenda).getTime() -
                        new Date(a.dataVenda).getTime()
                );

    }

    get vendasFiltradas(): Venda[] {

        return this.vendas.filter(
            venda => {

                const pagamentoOk =
                    !this.filtroPagamento ||
                    venda.formaPagamento ===
                    this.filtroPagamento;

                const buscaOk =
                    !this.textoBusca ||
                    venda.formaPagamento
                        .toLowerCase()
                        .includes(
                            this.textoBusca
                                .toLowerCase()
                        );

                return (
                    pagamentoOk &&
                    buscaOk
                );

            }
        );

    }

    get totalVendas(): number {

        return this.vendasFiltradas.length;

    }

    get faturamentoTotal(): number {

        return Number(
            this.vendasFiltradas
                .reduce(
                    (total, venda) =>
                        total + venda.valorTotal,
                    0
                )
                .toFixed(2)
        );

    }

    get ticketMedio(): number {

        if (this.totalVendas === 0) {
            return 0;
        }

        return Number(
            (
                this.faturamentoTotal /
                this.totalVendas
            ).toFixed(2)
        );

    }

    get totalFiados(): number {

        return this.vendasFiltradas
            .filter(
                venda =>
                    venda.formaPagamento === 'fiado'
            )
            .reduce(
                (total, venda) =>
                    total + venda.valorTotal,
                0
            );

    }

    selecionarVenda(
        venda: Venda
    ): void {

        this.vendaSelecionada = venda;

    }

    confirmarCancelamento(): void {

        if (
            !this.motivoCancelamento.trim()
        ) {

            alert(
                'Informe o motivo do cancelamento.'
            );

            return;

        }

        if (
            !this.vendaSelecionada ||
            this.vendaSelecionada.status === 'cancelada'
        ) {
            return;
        }

        const confirmar = confirm(
            'Deseja realmente cancelar esta venda?'
        );

        if (!confirmar) {
            return;
        }

        for (const item of this.vendaSelecionada.itens) {

            const produto =
                this.produtoService.buscarPorId(
                    item.produtoId
                );

            if (!produto) {
                continue;
            }

            produto.estoqueAtual +=
                item.quantidade;

            this.produtoService.atualizar(
                produto
            );

            const movimentacao: MovimentacaoEstoque = {

                id: crypto.randomUUID(),

                produtoId: produto.id,

                produtoNome: produto.nome,

                tipo: 'ajuste',

                quantidade: item.quantidade,

                observacao:
                    'Estorno de venda cancelada',

                dataMovimentacao:
                    new Date().toISOString()

            };

            this.movimentacaoService
                .registrarAjuste(
                    movimentacao
                );

        }

        if (
            this.vendaSelecionada.formaPagamento ===
            'fiado'
        ) {

            this.fiadoService.removerPorVenda(
                this.vendaSelecionada.id
            );

        }

        this.vendaSelecionada.status =
            'cancelada';

        this.vendaSelecionada.motivoCancelamento =
            this.motivoCancelamento;

        this.vendaService.atualizar(
            this.vendaSelecionada
        );

        this.vendas =
            this.vendaService
                .listar()
                .sort(
                    (a, b) =>
                        new Date(
                            b.dataVenda
                        ).getTime() -
                        new Date(
                            a.dataVenda
                        ).getTime()
                );

        alert(
            'Venda cancelada com sucesso.'
        );

        this.motivoCancelamento = '';

        this.mostrarCancelamento = false;

    }
}