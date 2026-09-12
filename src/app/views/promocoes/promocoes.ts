
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { PromocaoService } from '../../core/services/promocao.service';
import { Promocao } from '../../core/models/promocao.model';


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

    promocoes: Promocao[] = [];

    constructor(
        private produtoService: ProdutoService,
        private movimentacaoService: MovimentacaoEstoqueService,
        private promocaoService: PromocaoService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

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

        this.promocaoService
            .listar()
            .subscribe({

                next: promocoes => {

                    this.promocoes =
                        promocoes;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }

            });

        this.movimentacaoService
            .listar()
            .subscribe({

                next: movimentacoes => {

                    this.movimentacoes =
                        movimentacoes;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(erro);

                }

            });

    }

    obterPromocaoAtiva(
        produtoId: string
    ): Promocao | undefined {

        return this.promocoes.find(
            promocao =>
                promocao.produto.id === produtoId &&
                promocao.ativa
        );

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
        produto: Produto
    ): number {

        const desconto =
            this.obterPercentualDesconto(
                produto.id
            );

        return Number(
            (
                produto.precoVenda *
                (1 - desconto / 100)
            ).toFixed(2)
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

            .filter(produto => {

                const giro =
                    this.obterPercentualGiro(
                        produto.id
                    );

                const dias =
                    this.obterDiasEmEstoque(
                        produto.id
                    );

                return (

                    produto.ativo &&

                    produto.estoqueAtual > 0 &&

                    !(
                        produto.promocaoAtiva === false &&
                        produto.promocaoMotivo === 'Meta atingida'
                    ) &&

                    (

                        dias >= 30 ||

                        giro < 40

                    )

                );

            })

            .sort((a, b) => {

                if (
                    a.promocaoAtiva !==
                    b.promocaoAtiva
                ) {

                    return a.promocaoAtiva
                        ? 1
                        : -1;
                }

                if (!a.promocaoAtiva) {

                    return (
                        this.obterPesoPrioridade(
                            b.id
                        ) -

                        this.obterPesoPrioridade(
                            a.id
                        )
                    );
                }

                return (
                    this.obterDiasEmEstoque(
                        b.id
                    ) -

                    this.obterDiasEmEstoque(
                        a.id
                    )
                );

            });
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

        if (!produto.ativo) {

            this.alertService.warning(
                'Não é possível aplicar promoção em um produto inativo.'
            );

            return;
        }

        const precoPromocional =
            this.obterPrecoPromocional(
                produto
            );

        const percentualDesconto =
            this.obterPercentualDesconto(
                produto.id
            );

        const motivo =
            this.obterMotivoPersistencia(
                produto.id
            );

        this.promocaoService
            .criar({

                produtoId: produto.id,

                precoPromocional,

                percentualDesconto,

                motivo

            })
            .subscribe({

                next: () => {

                    produto.promocaoAtiva =
                        true;

                    produto.precoPromocional =
                        precoPromocional;

                    produto.promocaoMotivo =
                        motivo;

                    this.cdr.detectChanges();

                    this.alertService.success(
                        'Promoção ativada com sucesso.'
                    );
                },

                error: erro => {

                    console.error(
                        erro
                    );

                    this.alertService.error(
                        'Erro ao ativar promoção.'
                    );
                }

            });
    }

    desativarPromocao(
        produto: Produto
    ): void {

        const promocao =
            this.obterPromocaoAtiva(
                produto.id
            );

        if (!promocao) {

            this.alertService.warning(
                'Promoção não encontrada.'
            );

            return;
        }

        this.promocaoService
            .encerrar(
                promocao.id
            )
            .subscribe({

                next: () => {

                    produto.promocaoAtiva =
                        false;

                    produto.precoPromocional =
                        undefined;

                    produto.promocaoMotivo =
                        undefined;

                    this.cdr.detectChanges();

                    this.alertService.success(
                        'Promoção encerrada com sucesso.'
                    );
                },

                error: erro => {

                    console.error(
                        erro
                    );

                    this.alertService.error(
                        'Erro ao encerrar promoção.'
                    );
                }

            });
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

    obterMotivoPromocao(
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
            dias >= 30 &&
            giro < 40
        ) {
            return 'Crítico';
        }

        if (dias >= 30) {
            return 'Estoque Parado';
        }

        return 'Baixo Giro';
    }

    obterVariantMotivo(
        produtoId: string
    ): 'danger' | 'warning' {

        const motivo =
            this.obterMotivoPromocao(
                produtoId
            );

        if (motivo === 'Crítico') {
            return 'danger';
        }

        return 'warning';
    }

    obterDescricaoPromocao(
        produtoId: string
    ): string {

        const giro =
            this.obterPercentualGiro(produtoId);

        const dias =
            this.obterDiasEmEstoque(produtoId);

        if (
            dias >= 30 &&
            giro < 40
        ) {
            return `Produto com baixo giro (${giro}%) e ${dias} dias em estoque.`;
        }

        if (dias >= 30) {
            return `Produto parado há ${dias} dias.`;
        }

        return `Giro baixo (${giro}% das unidades vendidas).`;
    }

    obterEconomia(
        produto: Produto
    ): number {

        return Number(
            (
                produto.precoVenda -
                this.obterPrecoPromocional(
                    produto
                )
            ).toFixed(2)
        );

    }

    obterPercentualDesconto(
        produtoId: string
    ): number {

        const motivo =
            this.obterMotivoPromocao(
                produtoId
            );

        if (motivo === 'Crítico') {
            return 20;
        }

        if (motivo === 'Estoque Parado') {
            return 15;
        }

        return 10;
    }

    obterPerdaPorUnidade(
        produto: Produto
    ): number {

        return Number(
            (
                produto.precoVenda -
                this.obterPrecoPromocional(
                    produto
                )
            ).toFixed(2)
        );
    }

    obterImpactoFinanceiro(
        produto: Produto
    ): number {

        return Number(
            (
                this.obterPerdaPorUnidade(
                    produto
                ) *
                produto.estoqueAtual
            ).toFixed(2)
        );
    }

    obterMetaSugestao(
        produto: Produto
    ): number {

        return Math.ceil(
            produto.estoqueAtual * 0.5
        );
    }

    obterReceitaPotencial(
        produto: Produto
    ): number {

        return Number(
            (
                this.obterMetaSugestao(
                    produto
                ) *

                this.obterPrecoPromocional(
                    produto
                )

            ).toFixed(2)
        );
    }

    obterPercentualMeta(
        promocao: Promocao
    ): number {

        if (
            !promocao.metaUnidades ||
            promocao.metaUnidades === 0
        ) {
            return 0;
        }

        return Math.round(
            (
                promocao.unidadesVendidas /
                promocao.metaUnidades
            ) * 100
        );

    }

    obterIndicadorPromocao(
        produto: Produto
    ): string {

        return produto.promocaoAtiva
            ? '✅'
            : '⚠️';
    }

    obterPesoPrioridade(
        produtoId: string
    ): number {

        const prioridade =
            this.obterPrioridade(
                produtoId
            );

        if (prioridade === 'Alta') {
            return 3;
        }

        if (prioridade === 'Média') {
            return 2;
        }

        return 1;
    }

    obterStatusMeta(
        promocao: Promocao
    ): string {

        if (
            !promocao.metaUnidades
        ) {

            return 'Meta não definida';
        }

        return `${promocao.unidadesVendidas} de ${promocao.metaUnidades} unidades`;

    }

    obterMotivoPersistencia(
        produtoId: string
    ): 'giro-baixo' | 'estoque-parado' {

        const motivo =
            this.obterMotivoPromocao(
                produtoId
            );

        if (
            motivo === 'Estoque Parado'
        ) {
            return 'estoque-parado';
        }

        return 'giro-baixo';
    }
}   