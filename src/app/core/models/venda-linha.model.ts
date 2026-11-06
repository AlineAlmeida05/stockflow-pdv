import { Produto } from './produto.model';

export interface VendaLinha {

    id: string;

    produto?: Produto;

    quantidade: number;

}