import { Injectable } from '@angular/core';

import { MarketingCampaign } from '../models/marketing-campaign.model';

@Injectable({
    providedIn: 'root'
})

export class MarketingPromptBuilder {

    build(
        campanha: MarketingCampaign
    ): string {

        let estiloVisual = '';

        let estrategiaPromocional = '';

        let objetivoCampanha = '';

        let direcaoVisual = '';

        switch (campanha.tom) {

            case 'Promocional':

                estiloVisual = `
                    Utilizar cores vibrantes.
                    Destacar a promoção.
                    Sensação de oportunidade.
                    Ambiente comercial atrativo.
                    `;

                break;

            case 'Premium':

                estiloVisual = `
                    Utilizar visual sofisticado.
                    Aparência elegante.
                    Fundo premium.
                    Sensação de exclusividade.
                    `;

                break;

            case 'Urgente':

                estiloVisual = `
                    Criar senso de urgência.
                    Destacar oportunidade limitada.
                    Elementos visuais impactantes.
                    Comunicação direta.
                    `;

                break;

            case 'Divertido':

                estiloVisual = `
                    Comunicação descontraída.
                    Atmosfera festiva.
                    Visual moderno.
                    Cores alegres.
                    `;

                break;

        }

        switch (campanha.tipoPromocao) {

            case 'Mega Promoção':

                estrategiaPromocional = `
                    Criar sensação de grande oportunidade.
                    Destaque promocional intenso.
                    Comunicação forte e chamativa.
                    `;

                break;

            case 'Oferta Relâmpago':

                estrategiaPromocional = `
                    Destacar urgência.
                    Sensação de tempo limitado.
                    Comunicação imediata.
                    `;

                break;

            case 'Combo Especial':

                estrategiaPromocional = `
                    Destacar vantagem do combo.
                    Sensação de oferta exclusiva.
                    `;

                break;

            case 'Mais Vendido':

                estrategiaPromocional = `
                    Destacar popularidade do produto.
                    Utilizar prova social.
                    `;

                break;

            case 'Lançamento':

                estrategiaPromocional = `
                    Destacar novidade.
                    Criar curiosidade.
                    Comunicação moderna.
                    `;

                break;
        }

        switch (campanha.objetivo) {

            case 'Atrair Clientes':

                objetivoCampanha = `
                    Atrair novos consumidores.
                    Criar forte impacto visual.
                    Estimular curiosidade.
                    `;

                break;

            case 'Aumentar Vendas':

                objetivoCampanha = `
                    Incentivar compra imediata.
                    Dar destaque ao preço.
                    Aumentar conversão.
                    `;

                break;

            case 'Girar Estoque':

                objetivoCampanha = `
                    Estimular saída rápida do produto.
                    Criar sensação de oportunidade.
                    Destacar promoção.
                    `;

                break;

            case 'Divulgar Lançamento':

                objetivoCampanha = `
                    Destacar novidade.
                    Criar interesse no produto.
                    Transmitir inovação.
                    `;

                break;

            case 'Promover Combo':

                objetivoCampanha = `
                    Destacar vantagem do combo.
                    Comunicar economia.
                    Estimular compra conjunta.
                    `;

                break;
        }

        switch (campanha.elementoVisual) {

            case 'Gelo':

                direcaoVisual = `
                    Adicionar gelo.
                    Sensação de bebida gelada.
                    Reflexos frios.
                    `;

                break;

            case 'Fumaça':

                direcaoVisual = `
                    Adicionar fumaça leve.
                    Atmosfera dramática.
                    Profundidade visual.
                    `;

                break;

            case 'Neon':

                direcaoVisual = `
                    Utilizar iluminação neon.
                    Visual moderno.
                    Cores vibrantes.
                    `;

                break;

            case 'Luxo':

                direcaoVisual = `
                    Utilizar acabamento premium.
                    Detalhes sofisticados.
                    Iluminação elegante.
                    `;

                break;

            case 'Madeira':

                direcaoVisual = `
                    Elementos amadeirados.
                    Visual rústico premium.
                    Atmosfera de adega.
                    `;

                break;

            case 'Churrasco':

                direcaoVisual = `
                    Atmosfera de churrasco.
                    Elementos gastronômicos.
                    Visual descontraído.
                    `;

                break;

            case 'Balada':

                direcaoVisual = `
                    Luzes noturnas.
                    Atmosfera festiva.
                    Visual energético.
                    `;

                break;

            default:

                direcaoVisual = `
                    Escolher automaticamente o melhor elemento visual para o produto.
                    `;
        }

        return `
                    Crie uma arte publicitária profissional para divulgação de uma promoção de adega.

                    Informações da campanha:

                    Produto: ${campanha.produtoNome}

                    Contexto do Produto: ${campanha.contextoProduto}

                    Empresa: ${campanha.nomeEmpresa}

                    Slogan: ${campanha.sloganEmpresa}

                    Preço Promocional: R$ ${campanha.precoPromocional.toFixed(2)}

                    Tom da Campanha: ${campanha.tom}

                    Tipo da Promoção: ${campanha.tipoPromocao}

                    Estilo Visual: ${estiloVisual}

                    Estratégia Promocional: ${estrategiaPromocional}

                    Objetivo da Campanha: ${objetivoCampanha}

                    Elemento Visual Principal: ${campanha.elementoVisual}

                    Direção Visual: ${direcaoVisual}

                    Regras obrigatórias:

                    - Exibir o produto como elemento principal da arte
                    - Destacar o preço promocional
                    - Criar aparência profissional
                    - Arte pronta para divulgação comercial
                    - Visual moderno e atrativo
                    - Fundo relacionado ao universo de bebidas e adegas
                    - Não ocultar o preço
                    - Não ocultar o produto
                    - Utilizar composição visual equilibrada
                    - Utilizar iluminação publicitária de alta qualidade
                    - Utilizar identidade visual da empresa
                    - Dar destaque à marca
                    - Considerar o slogan da empresa na composição

                    Observações adicionais:

                    ${campanha.observacoes || 'Nenhuma'}

                    A arte deve parecer criada por um designer profissional.
                    `;
    }

}