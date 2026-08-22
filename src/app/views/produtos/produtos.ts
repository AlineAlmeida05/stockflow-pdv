import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { SearchInput } from '../../shared/components/search-input/search-input';

import { EmptyState } from '../../shared/components/empty-state/empty-state';

import { DataTable } from '../../shared/components/data-table/data-table';
import { Toolbar } from '../../shared/components/toolbar/toolbar';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    MainLayout,
    FormsModule,
    PageTitle,
    SearchInput,
    EmptyState,
    DataTable,
    Toolbar

  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos implements OnInit {

  produtos: Produto[] = [];

  nome = '';

  categoria = '';

  precoVenda = 0;

  codigoBarras = '';

  estoqueMinimo = 0;

  produtoEditandoId: string | null = null;

  estoqueAtual = 0;

  dataCadastro = '';

  textoBusca = '';

  mostrarFormulario = false;

  colunasProdutos = [
    {
      field: 'nome',
      header: 'Nome'
    },
    {
      field: 'categoria',
      header: 'Categoria'
    },
    {
      field: 'precoVenda',
      header: 'Preço Venda'
    },
    {
      field: 'estoqueAtual',
      header: 'Estoque'
    }

  ];

  constructor(
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {

    this.produtos =
      this.produtoService.listar();

  }

  salvarProduto(): void {

    if (!this.nome.trim()) {
      return;
    }

    if (this.produtoEditandoId) {

      this.produtoService.atualizar({

        id: this.produtoEditandoId,

        codigoBarras: this.codigoBarras,

        nome: this.nome,

        categoria: this.categoria,

        precoVenda: this.precoVenda,

        estoqueAtual: this.estoqueAtual,

        estoqueMinimo: this.estoqueMinimo,

        ativo: true,

        dataCadastro: this.dataCadastro

      });

    } else {

      this.produtoService.salvar({
        id: crypto.randomUUID(),

        codigoBarras: this.codigoBarras,

        nome: this.nome,

        categoria: this.categoria,

        precoVenda: this.precoVenda,

        estoqueAtual: 0,

        estoqueMinimo: this.estoqueMinimo,

        ativo: true,

        dataCadastro: new Date().toISOString()
      });

    }

    this.nome = '';
    this.categoria = '';
    this.codigoBarras = '';
    this.precoVenda = 0;
    this.estoqueMinimo = 0;

    this.produtoEditandoId = null;

    this.estoqueAtual = 0;

    this.dataCadastro = '';

    this.mostrarFormulario = false;

    this.carregarProdutos();

  }

  editarProduto(produto: Produto): void {

    this.mostrarFormulario = true;

    this.produtoEditandoId = produto.id;

    this.nome = produto.nome;

    this.categoria = produto.categoria;

    this.codigoBarras = produto.codigoBarras;

    this.precoVenda = produto.precoVenda;

    this.estoqueMinimo = produto.estoqueMinimo;

    this.estoqueAtual = produto.estoqueAtual;

    this.dataCadastro = produto.dataCadastro;

  }

  excluirProduto(id: string): void {

    const confirmar = confirm(
      'Deseja excluir este produto?'
    );

    if (!confirmar) {
      return;
    }

    this.produtoService.excluir(id);

    this.carregarProdutos();

  }

  get produtosFiltrados(): Produto[] {

    return this.produtos.filter(
      produto =>
        produto.nome
          .toLowerCase()
          .includes(
            this.textoBusca
              .toLowerCase()
          )
    );

  }

  novoProduto(): void {

    this.mostrarFormulario = true;

    this.produtoEditandoId = null;

    this.nome = '';

    this.categoria = '';

    this.codigoBarras = '';

    this.precoVenda = 0;

    this.estoqueMinimo = 0;

  }

  cancelarEdicao(): void {

    this.mostrarFormulario = false;

    this.produtoEditandoId = null;

    this.nome = '';

    this.categoria = '';

    this.codigoBarras = '';

    this.precoVenda = 0;

    this.estoqueMinimo = 0;

  }

  editarProdutoTabela(
    produto: unknown
  ): void {

    this.editarProduto(
      produto as Produto
    );

  }

  excluirProdutoTabela(
    produto: unknown
  ): void {

    this.excluirProduto(
      (produto as Produto).id
    );

  }
}