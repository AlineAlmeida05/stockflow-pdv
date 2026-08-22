import { Injectable } from '@angular/core';
import { MarketingAiResult } from '../../models/marketing-ai-result.model';
import { MarketingAiSuggestion } from '../../models/marketing-ai-suggestion.model';

@Injectable({
    providedIn: 'root'
})
export class MarketingAiService {

    gerarHeadline(
        tipoPromocao: string
    ): string {

        switch (tipoPromocao) {

            case 'Oferta Relâmpago':
                return '⚡ OFERTA RELÂMPAGO';

            case 'Combo Especial':
                return '🎁 COMBO ESPECIAL';

            case 'Mais Vendido':
                return '🏆 MAIS VENDIDO';

            case 'Lançamento':
                return '✨ LANÇAMENTO';

            default:
                return '🔥 MEGA PROMOÇÃO';
        }
    }

    gerarCta(
        objetivo: string
    ): string {

        switch (objetivo) {

            case 'Girar Estoque':
                return 'Aproveite antes que acabe.';

            case 'Divulgar Lançamento':
                return 'Conheça a novidade.';

            case 'Promover Combo':
                return 'Garanta seu combo agora.';

            default:
                return 'Peça agora mesmo.';
        }
    }

    gerarResultado(
        produtoNome: string,
        precoPromocional: number,
        tipoPromocao: string,
        tom: string
    ): MarketingAiResult {

        let introducao = '';

        switch (tom) {

            case 'Urgente':

                introducao =
                    '⏳ Corra, oferta por tempo limitado!';

                break;

            case 'Premium':

                introducao =
                    '✨ Uma oportunidade especial para quem aprecia qualidade.';

                break;

            case 'Divertido':

                introducao =
                    '🍻 Chame a galera e aproveite!';

                break;

            default:

                introducao =
                    '🔥 Não perca essa promoção!';
        }

        return {

            legenda:
                `${introducao}

${tipoPromocao}

${produtoNome}

Por apenas R$ ${precoPromocional.toFixed(2)}.`,

            hashtags: [
                '#promocao',
                '#adega',
                '#oferta',
                '#' + produtoNome
                    .split(' ')[0]
                    .toLowerCase()
            ],

            textoWhatsapp:
                `${tipoPromocao}

                ${produtoNome}

                R$ ${precoPromocional.toFixed(2)}

                ${introducao}`
        };
    }

    obterContextoProduto(
        produtoNome: string
    ): string {

        const nome =
            produtoNome.toLowerCase();

        if (
            nome.includes('skol') ||
            nome.includes('heineken') ||
            nome.includes('brahma') ||
            nome.includes('corona')
        ) {

            return `
                Produto do tipo cerveja.
                Transmitir sensação de bebida gelada.
                Utilizar gelo, gotas de água e iluminação fria.
                `;
        }

        if (
            nome.includes('jack') ||
            nome.includes('whisky') ||
            nome.includes('red label') ||
            nome.includes('black label')
        ) {

            return `
                Produto premium.
                Utilizar elementos sofisticados.
                Atmosfera elegante.
                Madeira escura e iluminação dourada.
                `;
        }

        if (
            nome.includes('red bull') ||
            nome.includes('monster')
        ) {

            return `
                Produto energético.
                Visual moderno.
                Luzes neon.
                Atmosfera noturna.
                `;
        }

        return `
                Produto de adega.
                Visual comercial moderno.
                Atmosfera profissional.
                `;
    }

    sugerirConfiguracao(
        produtoNome: string
    ): MarketingAiSuggestion {

        const nome =
            produtoNome.toLowerCase();

        if (
            nome.includes('skol') ||
            nome.includes('heineken') ||
            nome.includes('brahma') ||
            nome.includes('corona')
        ) {

            return {

                tom: 'Promocional',

                tipoPromocao:
                    'Mega Promoção',

                elementoVisual:
                    'Gelo'
            };
        }

        if (
            nome.includes('jack') ||
            nome.includes('whisky')
        ) {

            return {

                tom: 'Premium',

                tipoPromocao:
                    'Lançamento',

                elementoVisual:
                    'Madeira'
            };
        }

        return {

            tom: 'Promocional',

            tipoPromocao:
                'Mega Promoção',

            elementoVisual:
                'Automático'
        };
    }
}