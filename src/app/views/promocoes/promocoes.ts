import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { AlertService } from '../../core/services/alert.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { PromocaoService } from '../../core/services/promocao.service';
import { Promocao } from '../../core/models/promocao.model';
import { ProdutoPromocao } from '../../core/models/produto-promocao.model';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DataTable } from '../../shared/components/data-table/data-table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';

type PromocaoHistorico =
    Promocao & {

        statusPromocao: string;

        tipoRegistro:
        'ativa'
        | 'encerrada'
        | 'pendente';

        percentualMeta: number;

        descontoFormatado: string;

        dataInicioFormatada: string;

        dataFimFormatada: string;

    };
@Component({
    selector: 'app-promocoes',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        SplitPanel,
        StatusBadge,
        DataTable,
        DatePipe,
        CurrencyPipe,
        NgClass
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

    private produtoIdSelecionado?: string;

    mostrarPainel = false;

    promocaoSelecionada: PromocaoHistorico | null = null;

    colunasHistorico: {
        field: string;
        header: string;
        type?: 'text' | 'badge' | 'currency' | 'date' | 'progress' | 'toggle' | 'action';
        align?: 'left' | 'center' | 'right';
    }[] = [
            {
                field: 'statusPromocao',
                header: 'Status'
            },
            {
                field: 'dataInicioFormatada',
                header: 'Início'
            },
            {
                field: 'dataFimFormatada',
                header: 'Fim'
            },
            {
                field: 'statusMeta',
                header: 'Meta'
            },
            {
                field: 'percentualMeta',
                header: 'Progresso',
                type: 'progress'
            }

        ];

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
        private notificacaoService: NotificacaoService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.produtoIdSelecionado =
            this.route.snapshot
                .queryParamMap
                .get('produtoId')
            ?? undefined;

        this.carregarDados();

    }

    visualizarPromocao(
        promocao: any
    ): void {

        console.log(promocao);

        this.promocaoSelecionada = promocao;

        this.mostrarPainel = true;

    }

    fecharPainel(): void {

        this.mostrarPainel = false;

        this.promocaoSelecionada = null;

    }

    get historicoPromocoes(): PromocaoHistorico[] {

        if (!this.produtoSelecionado) {
            return [];
        }

        const produtoId = this.produtoSelecionado.id;

        const historico = this.promocoes

            .filter(
                promocao =>
                    promocao.produto.id ===
                    produtoId
            )

            .map(promocao => {

                const tipoRegistro:
                    'ativa' | 'encerrada' =
                    promocao.ativa
                        ? 'ativa'
                        : 'encerrada';

                return {

                    ...promocao,

                    tipoRegistro,

                    statusPromocao:
                        promocao.ativa
                            ? '✅ Ativa'
                            : '🏁 Encerrada',

                    percentualMeta:
                        promocao.metaUnidades > 0
                            ? Math.round(
                                (
                                    promocao.unidadesVendidas /
                                    promocao.metaUnidades
                                ) * 100
                            )
                            : 0,

                    statusMeta:
                        this.obterStatusMeta(
                            promocao
                        ),

                    descontoFormatado: `${promocao.percentualDesconto}%`,

                    dataInicioFormatada:
                        new Date(
                            promocao.dataInicio
                        ).toLocaleDateString(
                            'pt-BR'
                        ),

                    dataFimFormatada:
                        promocao.dataFim
                            ? new Date(
                                promocao.dataFim
                            ).toLocaleDateString(
                                'pt-BR'
                            )
                            : 'Ativa'

                } as PromocaoHistorico;

            })

            .sort(
                (a, b) =>
                    new Date(
                        b.dataInicio
                    ).getTime()
                    -
                    new Date(
                        a.dataInicio
                    ).getTime()
            );

        const possuiPromocaoAtiva =
            historico.some(
                item =>
                    item.tipoRegistro ===
                    'ativa'
            );

        if (
            !possuiPromocaoAtiva
        ) {
            historico.unshift({

                id: 'pendente' as any,

                produto: this.produtoSelecionado,

                precoOriginal: this.produtoSelecionado.precoVenda,

                precoPromocional:
                    this.obterPrecoPromocional(
                        this.produtoSelecionado
                    ),

                percentualDesconto:
                    this.obterPercentualDesconto(
                        produtoId
                    ),

                motivo:
                    this.obterMotivoPromocao(
                        produtoId
                    ),

                ativa: false,

                dataInicio: '',

                dataFim: undefined,

                estoqueInicio:
                    this.produtoSelecionado
                        .estoqueAtual,

                metaUnidades:
                    this.obterMetaSugestao(
                        this.produtoSelecionado
                    ),

                unidadesVendidas: 0,

                receitaGerada: 0,

                statusPromocao: '⚠️ Pendente',

                tipoRegistro: 'pendente',

                percentualMeta: 0,

                descontoFormatado:
                    `${this.obterPercentualDesconto(
                        produtoId
                    )}%`,

                dataInicioFormatada: '-',

                dataFimFormatada: '-'

            } as PromocaoHistorico);

        }

        return historico;


    }

    obterClasseProgresso(
        percentual: number
    ): string {

        if (percentual <= 25) {
            return 'progresso-danger';
        }

        if (percentual <= 75) {
            return 'progresso-warning';
        }

        return 'progresso-success';

    }

    metaAtingida(
        promocao: Promocao
    ): boolean {

        return (
            promocao.unidadesVendidas >=
            promocao.metaUnidades
        );

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
            return 'Prioridade Alta';
        }

        if (
            prioridadeBackend === 'MEDIA'
        ) {
            return 'Prioridade Média';
        }

        return 'Prioridade Baixa';

    }

    obterQuantidadeRestante(
        promocao: Promocao
    ): number {

        if (
            !promocao.metaUnidades
        ) {

            return 0;

        }

        return Math.max(
            0,
            promocao.metaUnidades -
            promocao.unidadesVendidas
        );

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

        this.promocaoService
            .criar({

                produtoId: produto.id

            })
            .subscribe({

                next: () => {

                    const produtoId = produto.id;

                    this.carregarDados();

                    setTimeout(() => {

                        this.restaurarProdutoSelecionado(
                            produtoId
                        );

                    });

                    this.notificacaoService.notificarAtualizacaoBadges();

                    this.cdr.detectChanges();

                    this.alertService.success(
                        'Promoção ativada com sucesso.'
                    );

                },

                error: erro => {

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

                    const produtoId = produto.id;

                    this.carregarDados();

                    setTimeout(() => {

                        this.restaurarProdutoSelecionado(
                            produtoId
                        );

                    });

                    this.notificacaoService.notificarAtualizacaoBadges();

                    this.cdr.detectChanges();

                    this.alertService.success(
                        'Promoção encerrada com sucesso.'
                    );

                },

                error: erro => {

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

        const prioridade = this.obterPrioridade(produtoId);

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

    get produtosAtivos(): Produto[] {

        return this.ativas
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

    get produtosAtivosFiltrados(): Produto[] {

        return this.ativas
            .map(item =>
                this.produtos.find(
                    produto =>
                        produto.id === item.id
                )
            )
            .filter(
                (produto): produto is Produto =>
                    !!produto
            )
            .filter(
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

    produtoEstaComPromocaoAtiva(
        produtoId: string
    ): boolean {

        return Boolean(
            this.obterDadosPromocao(
                produtoId
            )?.promocaoAtiva
        );

    }

    private carregarDados(): void {

        this.produtoService
            .listar()
            .subscribe({
                next: produtos => {

                    this.produtos = produtos;

                    if (
                        this.produtoIdSelecionado
                    ) {

                        const produto =
                            produtos.find(
                                item =>
                                    item.id ===
                                    this.produtoIdSelecionado
                            );

                        if (produto) {

                            this.produtoSelecionado = produto;

                        }

                    }

                    this.cdr.detectChanges();

                }
            });

        this.promocaoService
            .listar()
            .subscribe({
                next: promocoes => {

                    this.promocoes = promocoes;

                    this.cdr.detectChanges();
                }
            });

        this.promocaoService
            .listarPainel()
            .subscribe({
                next: painel => {

                    this.pendentes = painel.pendentes;

                    this.ativas = painel.ativas;

                    this.cdr.detectChanges();
                }
            });

    }

    private restaurarProdutoSelecionado(
        produtoId?: string
    ): void {

        if (!produtoId) {
            return;
        }

        this.produtoSelecionado =
            this.produtos.find(
                produto =>
                    produto.id === produtoId
            );

    }

    criarMarketing(
        produtoId: string
    ): void {

        this.router.navigate(
            ['/marketing'],
            {
                queryParams: {
                    produtoId
                }
            }
        );

    }


}   