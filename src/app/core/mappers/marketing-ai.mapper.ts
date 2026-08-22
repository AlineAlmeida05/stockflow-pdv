import { MarketingCampaign }
    from '../models/marketing-campaign.model';

import { MarketingAiRequest }
    from '../models/marketing-ai-request.model';

export class MarketingAiMapper {

    static toRequest(
        campanha: MarketingCampaign
    ): MarketingAiRequest {

        return {

            produtoNome:
                campanha.produtoNome,

            nomeEmpresa:
                campanha.nomeEmpresa,

            sloganEmpresa:
                campanha.sloganEmpresa,

            precoPromocional:
                campanha.precoPromocional,

            tom:
                campanha.tom,

            tipoPromocao:
                campanha.tipoPromocao,

            elementoVisual:
                campanha.elementoVisual,

            observacoes:
                campanha.observacoes
        };
    }

}