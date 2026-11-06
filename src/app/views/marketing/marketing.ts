import { Component } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { OnInit } from '@angular/core';
import { MarketingApiService } from '../../core/services/marketing-api.service';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { MarketingCampaignResponse } from '../../core/models/marketing-campaign-response.model';
import { FormsModule } from '@angular/forms';
import { ProdutoPromocao } from '../../core/models/produto-promocao.model';
import { PromocaoService } from '../../core/services/promocao.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { AlertService } from '../../core/services/alert.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-marketing',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        SplitPanel,
        FormsModule,
        EmptyState,
        DatePipe
    ],
    templateUrl: './marketing.html',
    styleUrl: './marketing.scss'
})
export class Marketing implements OnInit {

    constructor(
        private marketingApiService: MarketingApiService,
        private promocaoService: PromocaoService,
        private alertService: AlertService,
        private route: ActivatedRoute,
    ) { }

    campanhas: MarketingCampaignResponse[] = [];

    campanhaAtual?: MarketingCampaignResponse;

    promocoesAtivas: ProdutoPromocao[] = [];

    promocaoSelecionada = '';

    modoIaSelecionado = 'Automático';

    observacoes = '';

    tomSelecionado = 'Promocional';

    tipoPromocaoSelecionado = 'Mega Promoção';

    elementoVisualSelecionado = 'Automático';

    gerandoCampanha = false;

    ngOnInit(): void {

        this.promocaoService
            .listarPainel()
            .subscribe({

                next: painel => {

                    this.promocoesAtivas = painel.ativas;


                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

        this.marketingApiService
            .listar()
            .subscribe({

                next: campanhas => {

                    this.campanhas = campanhas;


                },

                error: erro => {

                    console.error(
                        'Erro ao carregar campanhas',
                        erro
                    );

                }

            });

        this.route.queryParams
            .subscribe(params => {

                const produtoId =
                    this.route.snapshot
                        .queryParamMap
                        .get('produtoId');

                if (
                    produtoId &&
                    this.promocoesAtivas.some(
                        item => item.id === produtoId
                    )
                ) {

                    this.promocaoSelecionada =
                        produtoId;

                }

            });

    }

    atualizarCampanha(
        campanha: MarketingCampaignResponse
    ): void {

        this.campanhaAtual = campanha;

    }

    gerarCampanha(): void {

        const produto =
            this.promocoesAtivas.find(
                item =>
                    item.id ===
                    this.promocaoSelecionada
            );

        if (!produto) {

            this.alertService.warning(
                'Selecione uma promoção para gerar a campanha.'
            );

            return;

        }

        this.gerandoCampanha = true;

        this.marketingApiService
            .gerarCampanha({

                produtoId: produto.id,

                tom: this.tomSelecionado,

                tipoPromocao: this.tipoPromocaoSelecionado,

                elementoVisual: this.elementoVisualSelecionado,

                observacoes: this.observacoes

            })
            .subscribe({

                next: campanha => {

                    this.gerandoCampanha = false;

                    this.campanhaAtual = campanha;

                    this.campanhas.unshift(
                        campanha
                    );

                },

                error: erro => {

                    this.gerandoCampanha = false;

                    console.error(
                        'Erro ao gerar campanha',
                        erro
                    );

                    this.alertService.error(
                        'Erro ao gerar campanha.'
                    );

                }

            });

    }

    copiarPrompt(): void {

        if (!this.campanhaAtual?.prompt) {

            return;

        }

        navigator.clipboard.writeText(
            this.campanhaAtual.prompt
        );

    }


}