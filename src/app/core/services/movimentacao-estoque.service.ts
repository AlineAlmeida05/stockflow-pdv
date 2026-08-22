import { Injectable } from '@angular/core';
import { MovimentacaoEstoque } from '../models/movimentacao-estoque.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoEstoqueService {

  private readonly STORAGE_KEY =
    'stockflow-movimentacoes-estoque';

  private obterMovimentacoes():
    MovimentacaoEstoque[] {

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

  private salvarMovimentacoes(
    movimentacoes: MovimentacaoEstoque[]
  ): void {

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(movimentacoes)
    );

  }

  listar(): MovimentacaoEstoque[] {

    return this.obterMovimentacoes();

  }

  buscarPorProduto(
    produtoId: string
  ): MovimentacaoEstoque[] {

    return this.obterMovimentacoes()
      .filter(
        movimentacao =>
          movimentacao.produtoId === produtoId
      );

  }

  registrar(
    movimentacao: MovimentacaoEstoque
  ): void {

    const movimentacoes =
      this.obterMovimentacoes();

    movimentacoes.push(
      movimentacao
    );

    this.salvarMovimentacoes(
      movimentacoes
    );

  }

  registrarEntrada(
    movimentacao: MovimentacaoEstoque
  ): void {

    this.registrar(movimentacao);

  }

  registrarSaida(
    movimentacao: MovimentacaoEstoque
  ): void {

    this.registrar(movimentacao);

  }

  registrarAjuste(
    movimentacao: MovimentacaoEstoque
  ): void {

    this.registrar(movimentacao);

  }

}