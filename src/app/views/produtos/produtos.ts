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
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { AlertService } from '../../core/services/alert.service';
import { ChangeDetectorRef } from '@angular/core';

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
    Toolbar,

  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos implements OnInit {

  produtos: Produto[] = [];

  nome = '';

  codigo = '';

  categoria = '';

  precoVenda = 0;

  codigoBarras = '';

  estoqueMinimo = 0;

  produtoEditandoId: string | null = null;

  estoqueAtual = 0;

  dataCadastro = '';

  textoBusca = '';

  mostrarFormulario = false;

  produtoAtivo = true;

  colunasProdutos: {
    field: string;
    header: string;
    type?:
    | 'text'
    | 'badge'
    | 'currency'
    | 'date';
    align?: 'left' | 'center' | 'right';
  }[] = [
      {
        field: 'codigo',
        header: 'Código'
      },
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
        header: 'Preço Venda',
        type: 'currency',
        align: 'right'
      },
      {
        field: 'precoPromocional',
        header: 'Preço Promo'
      },
      {
        field: 'promocaoAtiva',
        header: 'Promoção'
      },
      {
        field: 'estoqueAtual',
        header: 'Estoque',
        align: 'right'
      }, {
        field: 'ativo',
        header: 'Status'
      }
    ];

  constructor(
    private produtoService: ProdutoService,
    private confirmDialogService: ConfirmDialogService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {

    this.produtoService
      .listar()
      .subscribe({

        next: produtos => {

          this.produtos = [...produtos];

          this.cdr.detectChanges();

        },

        error: erro => {

          console.error(
            'Erro ao carregar produtos',
            erro
          );

        }

      });

  }

  salvarProduto(): void {

    if (!this.nome.trim()) {

      this.alertService.warning(
        'Informe o nome do produto.'
      );

      return;

    }

    if (this.produtoEditandoId) {

      this.produtoService
        .atualizar({
          id: this.produtoEditandoId,
          codigoBarras: this.codigoBarras,
          nome: this.nome,
          categoria: this.categoria,
          precoVenda: this.precoVenda,
          estoqueAtual: this.estoqueAtual,
          estoqueMinimo: this.estoqueMinimo,
          ativo: this.produtoAtivo,
          dataCadastro: this.dataCadastro
        } as Produto)
        .subscribe({

          next: () => {

            this.alertService.success(
              'Produto atualizado com sucesso.'
            );

            this.carregarProdutos();

          }

        });

    } else {

      this.produtoService
        .salvar({

          id: '',

          codigoBarras: this.codigoBarras,

          nome: this.nome,

          categoria: this.categoria,

          precoVenda: this.precoVenda,

          estoqueAtual: 0,

          estoqueMinimo: this.estoqueMinimo,

          ativo: this.produtoAtivo,

          dataCadastro: ''

        } as Produto)
        .subscribe({

          next: () => {

            this.alertService.success(
              'Produto cadastrado com sucesso.'
            );

            this.carregarProdutos();

          }

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

    this.produtoAtivo = produto.ativo;

    this.codigoBarras = produto.codigoBarras;

    this.precoVenda = produto.precoVenda;

    this.estoqueMinimo = produto.estoqueMinimo;

    this.estoqueAtual = produto.estoqueAtual;

    this.dataCadastro = produto.dataCadastro;

  }

  excluirProduto(
    produto: Produto
  ): void {

    if (!produto.ativo) {

      this.reativarProduto(
        produto.id
      );

      return;

    }

    this.confirmDialogService.open({

      title: 'Inativar Produto',

      message:
        'Deseja realmente inativar este produto? O histórico será preservado.',

      confirmText: 'Inativar',

      cancelText: 'Cancelar',

      onConfirm: () => {

        this.alertService.info(
          'Inativando produto...'
        );

        this.produtoService
          .excluir(
            produto.id,

          )

          .subscribe({

            next: () => {

              this.carregarProdutos();

              this.alertService.success(
                'Produto inativado com sucesso.'
              );

            }

          });

      }

    });

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
      produto as Produto
    );

  }

  reativarProduto(
    id: string
  ): void {

    this.confirmDialogService.open({

      title: 'Reativar Produto',

      message:
        'Deseja realmente reativar este produto?',

      confirmText: 'Reativar',

      cancelText: 'Cancelar',

      onConfirm: () => {

        this.alertService.info(
          'Reativando produto...'
        );

        this.produtoService
          .reativar(id)
          .subscribe({

            next: () => {

              this.carregarProdutos();

              this.alertService.success(
                'Produto reativado com sucesso.'
              );

            }

          });

      }

    });

  }
}