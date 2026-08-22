import { Injectable } from '@angular/core';
import { Pagamento } from '../models/pagamento.model';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private readonly STORAGE_KEY =
    'stockflow-pagamentos';

  private obterPagamentos(): Pagamento[] {

    if (typeof window === 'undefined') {
      return [];
    }

    const dados =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);

  }

  private salvarPagamentos(
    pagamentos: Pagamento[]
  ): void {

    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(pagamentos)
    );

  }

  listar(): Pagamento[] {

    return this.obterPagamentos();

  }

  salvar(
    pagamento: Pagamento
  ): void {

    const pagamentos =
      this.obterPagamentos();

    pagamentos.push(pagamento);

    this.salvarPagamentos(
      pagamentos
    );

  }

  buscarPorCliente(
    clienteId: string
  ): Pagamento[] {

    return this.obterPagamentos()
      .filter(
        pagamento =>
          pagamento.clienteId === clienteId
      );

  }

}