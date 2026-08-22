export interface ItemVenda {

  produtoId: string;

  produtoNome: string;

  quantidade: number;

  valorUnitario: number;

  subtotal: number;

  promocaoAplicada?: boolean;

}