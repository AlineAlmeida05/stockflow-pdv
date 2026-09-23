import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProdutoService } from '../../../../core/services/produto.service';
import { MarketingCampaignResponse } from '../../../../core/models/marketing-campaign-response.model';
import { EmpresaService } from '../../../../core/services/empresa.service';
import { Empresa } from '../../../../core/models/empresa.model';
import { FormsModule } from '@angular/forms';
import { MarketingApiService } from '../../../../core/services/marketing-api.service';
import { PromocaoService } from '../../../../core/services/promocao.service';
import { ProdutoPromocao } from '../../../../core/models/produto-promocao.model';

@Component({
    selector: 'app-marketing-campaign-form',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './marketing-campaign-form.html',
    styleUrl: './marketing-campaign-form.scss'
})

export class MarketingCampaignForm

    implements OnInit {

    empresa!: Empresa;

    promocoesAtivas: ProdutoPromocao[] = [];

    promocaoSelecionada = '';

    tomSelecionado = 'Promocional';

    tipoPromocaoSelecionado = 'Mega Promoção';

    elementoVisualSelecionado = 'Automático';

    modoIaSelecionado = 'Automático';

    observacoes = '';

    @Output()
    campanhaGerada =
        new EventEmitter<MarketingCampaignResponse>();

    constructor(
        private empresaService: EmpresaService,
        private marketingApiService: MarketingApiService,
        private promocaoService: PromocaoService,

    ) { }

    ngOnInit(): void {

        this.promocaoService
            .listarPainel()
            .subscribe({

                next: painel => {

                    this.promocoesAtivas =
                        painel.ativas;

                    console.log(
                        'Promocoes Ativas',
                        this.promocoesAtivas
                    );

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar promoções',
                        erro
                    );

                }

            });

        this.empresaService
            .obter()
            .subscribe({

                next: empresa => {

                    this.empresa = empresa;

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar empresa',
                        erro
                    );

                }

            });

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

                    this.campanhaGerada.emit(
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

}