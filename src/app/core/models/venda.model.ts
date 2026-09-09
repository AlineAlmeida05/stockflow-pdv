import { ItemVenda } from './item-venda.model';

export interface Venda {

  id: string;

  dataVenda: string;

  formaPagamento:
  | 'Selecione...'
  | 'pix'
  | 'dinheiro'
  | 'debito'
  | 'credito'
  | 'fiado';

  valorTotal: number;

  quantidadeItens: number;

  clienteId?: string;

  clienteNome?: string;

  status:
  | 'finalizada'
  | 'cancelada';

  motivoCancelamento?: string;

  dataCancelamento?: string;

  usuarioCancelamento?: string;

  usuarioNome?: string;

  itens: ItemVenda[];

}