import { Produto } from './produto.model';

export interface ItemCarrinho {

    produto: Produto;

    precoUnitario: number;

    quantidade: number;

    subtotal: number;

    promocaoAplicada?: boolean;
}