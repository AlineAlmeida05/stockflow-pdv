
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Produto } from '../../core/models/produto.model';

import { ProdutoService } from '../../core/services/produto.service';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { SearchInput } from '../../shared/components/search-input/search-input';

import { AlertService } from '../../core/services/alert.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { PromocaoService } from '../../core/services/promocao.service';
import { Promocao } from '../../core/models/promocao.model';
import { ProdutoPromocao } from '../../core/models/produto-promocao.model';


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

    produtoSelecionado?: Produto;

    textoBusca = '';

    promocoes: Promocao[] = [];

    pendentes: ProdutoPromocao[] = [];

    ativas: ProdutoPromocao[] = [];


    obterMotivoBackend(
        produtoId: string
    ): string {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.motivo
            ??
            ''
        );

    }

    obterPrioridadeBackend(
        produtoId: string
    ): string {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.prioridade
            ??
            ''
        );

    }

    obterDiasEstoqueBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.diasEstoque
            ??
            -1
        );

    }

    obterPercentualGiroBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.percentualGiro
            ??
            -1
        );

    }

    obterPercentualDescontoBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.percentualDesconto
            ??
            -1
        );

    }

    obterMetaSugestaoBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.metaSugestao
            ??
            -1
        );

    }

    obterPrecoPromocionalBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.precoPromocional
            ??
            -1
        );

    }

    obterReceitaPotencialBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.receitaPotencial
            ??
            -1
        );

    }
    
    obterEconomiaBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.economiaUnitaria
            ??
            0
        );

    }

    obterImpactoFinanceiroBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.impactoFinanceiro
            ??
            0
        );

    }

    obterQuantidadeCompradaBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.quantidadeComprada
            ??
            0
        );

    }

    obterQuantidadeVendidaBackend(
        produtoId: string
    ): number {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.quantidadeVendida
            ??
            0
        );

    }

    obterPromocaoEficienteBackend(
        produtoId: string
    ): boolean {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.promocaoEficiente
            ??
            false
        );

    }

    obterDescricaoPromocaoBackend(
        produtoId: string
    ): string {

        return (
            this.obterDadosPromocao(
                produtoId
            )?.descricaoPromocao
            ??
            ''
        );

    }

    constructor(
        private produtoService: ProdutoService,
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

        this.promocaoService
            .listarPainel()
            .subscribe({

                next: painel => {

                    this.pendentes =
                        painel.pendentes;

                    this.ativas =
                        painel.ativas;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

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

        return this.obterQuantidadeCompradaBackend(
            produtoId
        );

    }

    obterQuantidadeVendida(
        produtoId: string
    ): number {

        return this.obterQuantidadeVendidaBackend(
            produtoId
        );

    }

    obterPercentualGiro(
        produtoId: string
    ): number {

        return Math.max(
            0,
            this.obterPercentualGiroBackend(
                produtoId
            )
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

        return Math.max(
            0,
            this.obterPrecoPromocionalBackend(
                produto.id
            )
        );

    }

    obterDiasEmEstoque(
        produtoId: string
    ): number {

        return Math.max(
            0,
            this.obterDiasEstoqueBackend(
                produtoId
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

        const prioridadeBackend =
            this.obterPrioridadeBackend(
                produtoId
            );

        if (
            prioridadeBackend === 'ALTA'
        ) {
            return 'Alta';
        }

        if (
            prioridadeBackend === 'MEDIA'
        ) {
            return 'Média';
        }

        return prioridadeBackend;

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

                    this.cdr.detectChanges();
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

                    this.cdr.detectChanges();
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

        return this.obterPromocaoEficienteBackend(
            produtoId
        );

    }

    selecionarProduto(
        produto: Produto
    ): void {

        this.produtoSelecionado = produto;

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

        return (
            this.obterMotivoBackend(
                produtoId
            ) || 'Baixo Giro'
        );

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

        return this.obterDescricaoPromocaoBackend(
            produtoId
        );

    }

    obterEconomia(
        produto: Produto
    ): number {

        return Math.max(
            0,
            this.obterEconomiaBackend(
                produto.id
            )
        );

    }

    obterPercentualDesconto(
        produtoId: string
    ): number {

        return Math.max(
            0,
            this.obterPercentualDescontoBackend(
                produtoId
            )
        );

    }

    obterImpactoFinanceiro(
        produto: Produto
    ): number {

        return Math.max(
            0,
            this.obterImpactoFinanceiroBackend(
                produto.id
            )
        );

    }

    obterMetaSugestao(
        produto: Produto
    ): number {

        return Math.max(
            0,
            this.obterMetaSugestaoBackend(
                produto.id
            )
        );

    }

    obterReceitaPotencial(
        produto: Produto
    ): number {

        return Math.max(
            0,
            this.obterReceitaPotencialBackend(
                produto.id
            )
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

    get promocoesPainel(): ProdutoPromocao[] {

        return [

            ...this.pendentes,

            ...this.ativas

        ];

    }

    get produtosPainel(): Produto[] {

        return this.promocoesPainel
            .map(item =>
                this.produtos.find(
                    produto =>
                        produto.id === item.id
                )
            )
            .filter(
                (produto): produto is Produto =>
                    !!produto
            );

    }

    get produtosPainelFiltrados(): Produto[] {

        return this.produtosPainel.filter(
            produto =>
                produto.nome
                    .toLowerCase()
                    .includes(
                        this.textoBusca
                            .toLowerCase()
                    )
        );

    }

    obterDadosPromocao(
        produtoId: string
    ): ProdutoPromocao | undefined {

        return this.promocoesPainel.find(
            item =>
                item.id === produtoId
        );

    }

    
}   