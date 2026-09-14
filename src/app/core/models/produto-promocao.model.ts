export interface ProdutoPromocao {

    id: string;

    nome: string;

    estoqueAtual: number;

    percentualGiro: number;

    diasEstoque: number;

    promocaoAtiva: boolean;

    prioridade: string;

    motivo: string;

    percentualDesconto: number;

    metaSugestao: number;

    precoPromocional: number;

    receitaPotencial: number;

    economiaUnitaria: number;

    impactoFinanceiro: number;

    quantidadeComprada: number;

    quantidadeVendida: number;

    promocaoEficiente: boolean;

    descricaoPromocao: string;

}