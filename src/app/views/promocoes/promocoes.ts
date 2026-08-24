
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Produto } from '../../core/models/produto.model';
import { MovimentacaoEstoque } from '../../core/models/movimentacao-estoque.model';

import { ProdutoService } from '../../core/services/produto.service';
import { MovimentacaoEstoqueService } from '../../core/services/movimentacao-estoque.service';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { SearchInput } from '../../shared/components/search-input/search-input';

import { AlertService } from '../../core/services/alert.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { StatCard } from '../../shared/components/stat-card/stat-card';


@Component({
    selector: 'app-promocoes',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        PageTitle,
        EmptyState,
        SplitPanel,
        SearchInput,
        StatusBadge,
        StatCard
    ],
    templateUrl: './promocoes.html',
    styleUrl: './promocoes.scss'
})
export class Promocoes implements OnInit {

    produtos: Produto[] = [];

    movimentacoes: MovimentacaoEstoque[] = [];

    produtoSelecionado?: Produto;

    textoBusca = '';


    constructor(
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {

        this.produtos =
            this.produtoService.listar();

        this.movimentacoes =
            this.movimentacaoService.listar();

    }

    obterQuantidadeComprada(
        produtoId: string
    ): number {

        return this.movimentacoes
            .filter(
                mov =>
                    mov.produtoId === produtoId &&
                    mov.tipo === 'entrada'
            )
            .reduce(
                (total, mov) =>
                    total + mov.quantidade,
                0
            );

    }

    obterQuantidadeVendida(
        produtoId: string
    ): number {

        return this.movimentacoes
            .filter(
                mov =>
                    mov.produtoId === produtoId &&
                    mov.tipo === 'saida'
            )
            .reduce(
                (total, mov) =>
                    total + mov.quantidade,
                0
            );

    }

    obterPercentualGiro(
        produtoId: string
    ): number {

        const comprado =
            this.obterQuantidadeComprada(
                produtoId
            );

        const vendido =
            this.obterQuantidadeVendida(
                produtoId
            );

        if (comprado === 0) {
            return 0;
        }

        return Math.round(
            (vendido / comprado) * 100
        );

    }

    obterStatusGiro(
        produtoId: string
    ): string {

        const percentual =
            this.obterPercentualGiro(
                produtoId
            );

        if (percentual >= 70) {
            return 'Giro Alto';
        }

        if (percentual >= 40) {
            return 'Giro Médio';
        }

        return 'Giro Baixo';

    }

    obterPrecoPromocional(
        precoVenda: number
    ): number {

        return Number(
            (precoVenda * 0.9)
                .toFixed(2)
        );

    }

    obterDiasEmEstoque(
        produtoId: string
    ): number {

        const entradas =
            this.movimentacoes
                .filter(
                    mov =>
                        mov.produtoId === produtoId &&
                        mov.tipo === 'entrada'
                )
                .sort(
                    (a, b) =>
                        new Date(
                            b.dataMovimentacao
                        ).getTime() -
                        new Date(
                            a.dataMovimentacao
                        ).getTime()
                );

        if (entradas.length === 0) {
            return 0;
        }

        const ultimaEntrada =
            new Date(
                entradas[0].dataMovimentacao
            );

        const hoje =
            new Date();

        const diferenca =
            hoje.getTime() -
            ultimaEntrada.getTime();

        return Math.floor(
            diferenca /
            (1000 * 60 * 60 * 24)
        );

    }

    get produtosPromocao(): Produto[] {

        return [...this.produtos]
            .filter(
                produto =>
                    produto.estoqueAtual > 0
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    this.obterDiasEmEstoque(
                        b.id
                    ) -
                    this.obterDiasEmEstoque(
                        a.id
                    )
            );

    }

    obterStatusEstoque(
        produtoId: string
    ): string {

        const dias =
            this.obterDiasEmEstoque(
                produtoId
            );

        if (dias >= 30) {
            return 'Produto Parado';
        }

        if (dias >= 15) {
            return 'Atenção';
        }

        return 'Recente';

    }

    obterPrioridade(
        produtoId: string
    ): string {

        const giro =
            this.obterPercentualGiro(
                produtoId
            );

        const dias =
            this.obterDiasEmEstoque(
                produtoId
            );

        if (
            giro < 40 &&
            dias >= 30
        ) {

            return 'Alta';

        }

        if (
            giro < 70 ||
            dias >= 15
        ) {

            return 'Média';

        }

        return 'Baixa';

    }

    ativarPromocao(
        produto: Produto
    ): void {

        produto.promocaoAtiva = true;

        produto.precoPromocional =
            this.obterPrecoPromocional(
                produto.precoVenda
            );

        produto.dataInicioPromocao =
            new Date().toISOString();

        produto.promocaoMotivo =
            'giro-baixo';

        this.produtoService.atualizar(
            produto
        );

        this.alertService.success(
            'Promoção ativada com sucesso.'
        );

    }

    desativarPromocao(
        produto: Produto
    ): void {

        produto.promocaoAtiva = false;

        produto.precoPromocional = undefined;

        produto.dataInicioPromocao = undefined;

        produto.dataFimPromocao = undefined;

        this.produtoService.atualizar(
            produto
        );

        this.alertService.success(
            'Promoção desativada com sucesso.'
        );

    }

    promocaoAtingiuObjetivo(
        produtoId: string
    ): boolean {

        return (
            this.obterPercentualGiro(
                produtoId
            ) >= 70
        );

    }

    selecionarProduto(
        produto: Produto
    ): void {

        this.produtoSelecionado = produto;

    }

    get produtosPromocaoFiltrados(): Produto[] {

        return this.produtosPromocao.filter(
            produto =>
                produto.nome
                    .toLowerCase()
                    .includes(
                        this.textoBusca
                            .toLowerCase()
                    )
        );

    }

    obterVariantGiro(
        produtoId: string
    ): 'success' | 'warning' | 'danger' {

        const percentual =
            this.obterPercentualGiro(
                produtoId
            );

        if (percentual >= 70) {
            return 'success';
        }

        if (percentual >= 40) {
            return 'warning';
        }

        return 'danger';

    }

    obterVariantPrioridade(
        produtoId: string
    ): 'success' | 'warning' | 'danger' {

        const prioridade =
            this.obterPrioridade(produtoId);

        if (
            prioridade.includes('Alta')
        ) {
            return 'danger';
        }

        if (
            prioridade.includes('Média')
        ) {
            return 'warning';
        }

        return 'success';

    }

    obterVariantEstoque(
        produtoId: string
    ): 'success' | 'warning' | 'danger' {

        const dias =
            this.obterDiasEmEstoque(
                produtoId
            );

        if (dias >= 30) {
            return 'danger';
        }

        if (dias >= 15) {
            return 'warning';
        }

        return 'success';

    }
}