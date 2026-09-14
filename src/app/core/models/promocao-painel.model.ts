import { ProdutoPromocao } from './produto-promocao.model';

export interface PromocaoPainel {

    pendentes: ProdutoPromocao[];

    ativas: ProdutoPromocao[];

}