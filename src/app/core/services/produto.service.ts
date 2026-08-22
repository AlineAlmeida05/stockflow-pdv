import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly STORAGE_KEY =
    'stockflow-produtos';

  private obterProdutos(): Produto[] {

    if (typeof window === 'undefined') {
      return [];
    }

    const dados =
      localStorage.getItem(this.STORAGE_KEY);

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);

  }

  private salvarProdutos(
    produtos: Produto[]
  ): void {

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(produtos)
    );

  }

  listar(): Produto[] {

    return this.obterProdutos();

  }

  buscarPorId(
    id: string
  ): Produto | undefined {

    return this.obterProdutos()
      .find(produto => produto.id === id);

  }

  salvar(
    produto: Produto
  ): void {

    const produtos =
      this.obterProdutos();

    produtos.push(produto);

    this.salvarProdutos(produtos);

  }

  atualizar(
    produtoAtualizado: Produto
  ): void {

    const produtos =
      this.obterProdutos();

    const indice =
      produtos.findIndex(
        produto =>
          produto.id === produtoAtualizado.id
      );

    if (indice === -1) {
      return;
    }

    produtos[indice] =
      produtoAtualizado;

    this.salvarProdutos(produtos);

  }

  excluir(id: string): void {

    const produtos =
      this.obterProdutos();

    const produtosAtualizados =
      produtos.filter(
        produto => produto.id !== id
      );

    this.salvarProdutos(
      produtosAtualizados
    );

  }

}
