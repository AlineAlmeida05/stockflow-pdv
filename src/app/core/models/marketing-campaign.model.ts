import { MarketingAiResult } from './marketing-ai-result.model';

export interface MarketingCampaign {

    produtoNome: string;

    nomeEmpresa: string;

    sloganEmpresa: string;

    precoOriginal: number;

    precoPromocional: number;

    headline: string;

    cta: string;

    tipoPromocao: string;

    objetivo: string;

    elementoVisual: string;

    tom: string;

    observacoes: string;

    contextoProduto?: string;

    prompt?: string;

    resultadoIa?: MarketingAiResult;

    dataCriacao: string;

}