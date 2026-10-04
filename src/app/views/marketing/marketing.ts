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

@Component({
    selector: 'app-marketing',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        SplitPanel,
        FormsModule,
        EmptyState
    ],
    templateUrl: './marketing.html',
    styleUrl: './marketing.scss'
})
export class Marketing implements OnInit {

    constructor(
        private marketingApiService:
            MarketingApiService,

        private promocaoService:
            PromocaoService
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


    ngOnInit(): void {

        this.promocaoService
            .listarPainel()
            .subscribe({

                next: painel => {

                    this.promocoesAtivas =
                        painel.ativas;

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

                    this.campanhas =
                        campanhas;

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar campanhas',
                        erro
                    );

                }

            });

    }

    atualizarCampanha(
        campanha: MarketingCampaignResponse
    ): void {

        this.campanhaAtual = campanha;

        this.campanhas.unshift(
            campanha
        );

    }

    gerarCampanha(): void {

        const produto =
            this.promocoesAtivas.find(
                item =>
                    item.id ===
                    this.promocaoSelecionada
            );

        if (!produto) {
            return;
        }

        this.marketingApiService
            .gerarCampanha({

                produtoId: produto.id,

                tom:
                    this.tomSelecionado,

                tipoPromocao:
                    this.tipoPromocaoSelecionado,

                elementoVisual:
                    this.elementoVisualSelecionado,

                observacoes:
                    this.observacoes

            })
            .subscribe({

                next: campanha => {

                    this.campanhaAtual =
                        campanha;

                    this.campanhas.unshift(
                        campanha
                    );

                },

                error: erro => {

                    console.error(
                        'Erro ao gerar campanha',
                        erro
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