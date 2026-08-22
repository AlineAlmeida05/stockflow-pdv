import { MarketingAiResult } from './marketing-ai-result.model';
import { MarketingAiSuggestion } from './marketing-ai-suggestion.model';

export interface MarketingCampaign {

    produtoNome: string;

    nomeEmpresa: string;

    sloganEmpresa: string;

    precoOriginal: number;

    precoPromocional: number;

    tipoPromocao: string;

    elementoVisual: string;

    tom: string;

    observacoes: string;

    contextoProduto?: string;

    sugestaoIa?: MarketingAiSuggestion;

    prompt?: string;

    resultadoIa?: MarketingAiResult;

    dataCriacao: string;

}