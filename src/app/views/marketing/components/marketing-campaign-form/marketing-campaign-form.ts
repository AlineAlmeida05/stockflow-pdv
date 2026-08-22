import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Produto } from '../../../../core/models/produto.model';

import { ProdutoService } from '../../../../core/services/produto.service';
import { MarketingCampaign } from '../../../../core/models/marketing-campaign.model';
import { EmpresaService } from '../../../../core/services/empresa.service';

import { Empresa } from '../../../../core/models/empresa.model';
import { FormsModule } from '@angular/forms';
import { MarketingAiService } from '../../../../core/services/marketing-ai/marketing-ai.service';

import { MarketingPromptBuilder } from '../../../../core/builders/marketing-prompt.builder';
import { MarketingAiMapper } from '../../../../core/mappers/marketing-ai.mapper';

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

    promocoesAtivas: Produto[] = [];

    promocaoSelecionada = '';

    tomSelecionado = 'Promocional';

    tipoPromocaoSelecionado = 'Mega Promoção';

    elementoVisualSelecionado = 'Automático';

    modoIaSelecionado = 'Automático';

    observacoes = '';

    @Output()
    campanhaGerada =
        new EventEmitter<MarketingCampaign>();

    constructor(
        private produtoService: ProdutoService,
        private empresaService: EmpresaService,
        private marketingAiService: MarketingAiService,
        private marketingPromptBuilder: MarketingPromptBuilder,

    ) { }

    ngOnInit(): void {

        this.promocoesAtivas =
            this.produtoService
                .listar()
                .filter(
                    produto =>
                        produto.promocaoAtiva
                );

        this.empresa = this.empresaService.obter();

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

        const sugestao =
            this.marketingAiService
                .sugerirConfiguracao(
                    produto.nome
                );

        console.log(
            'Sugestão IA',
            sugestao
        );

        if (
            this.modoIaSelecionado ===
            'Automático'
        ) {

            this.tomSelecionado =
                sugestao.tom;

            this.tipoPromocaoSelecionado =
                sugestao.tipoPromocao;

            this.elementoVisualSelecionado =
                sugestao.elementoVisual;
        }         

        const resultadoIa =
            this.marketingAiService
                .gerarResultado(
                    produto.nome,
                    produto.precoPromocional ?? 0,
                    this.tipoPromocaoSelecionado,
                    this.tomSelecionado
                );

        const contextoProduto =
            this.marketingAiService
                .obterContextoProduto(
                    produto.nome
                );

        const campanha: MarketingCampaign = {

            produtoNome: produto.nome,

            nomeEmpresa: this.empresa.nomeFantasia,

            sloganEmpresa: this.empresa.slogan,

            precoOriginal: produto.precoVenda,

            precoPromocional: produto.precoPromocional ?? 0,

            tipoPromocao: this.tipoPromocaoSelecionado,

            elementoVisual: this.elementoVisualSelecionado,

            contextoProduto: contextoProduto,

            tom: this.tomSelecionado,

            sugestaoIa: sugestao,

            observacoes: this.observacoes,

            resultadoIa: resultadoIa,

            prompt: '',

            dataCriacao: new Date().toISOString(),

        };

        campanha.prompt =
            this.marketingPromptBuilder
                .build(campanha);

        const request =
            MarketingAiMapper
                .toRequest(campanha);

        console.log(
            'Marketing AI Request',
            request
        );

        this.campanhaGerada.emit(
            campanha
        );

    }

}