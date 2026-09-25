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

  modoVisualizacao = false;

  produtoAtivo = true;

  salvandoProduto = false;

  produtoSelecionado: Produto | null = null;

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
        field: 'nome',
        header: 'Produto'
      },
      {
        field: 'precoVenda',
        header: 'Preço Venda',
        type: 'currency',
        align: 'center'
      },
      {
        field: 'precoPromocional',
        header: 'Preço Promo',
        type: 'currency',
        align: 'center'
      },
      {
        field: 'status',
        header: 'Status',
        type: 'badge',
        align: 'center'
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

          console.log(produtos);

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

    if (this.salvandoProduto) {
      return;
    }

    if (!this.nome.trim()) {

      this.alertService.warning(
        'Informe o nome do produto.'
      );

      return;

    }
    if (
      this.estoqueMinimo <= 0
    ) {

      this.alertService.warning(
        'Informe um estoque mínimo válido.'
      );

      return;

    }
    if (
      this.precoVenda <= 0
    ) {

      this.alertService.warning(
        'Informe um preço de venda válido.'
      );

      return;

    }

    if (this.produtoEditandoId) {

      this.salvandoProduto = true;

      this.alertService.info(
        this.produtoEditandoId
          ? 'Atualizando produto...'
          : 'Cadastrando produto...'
      );

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

            this.salvandoProduto = false;

            this.limparFormulario();

            this.carregarProdutos();

            this.alertService.success(
              'Produto atualizado com sucesso.'
            );

          },
          error: erro => {

            this.salvandoProduto = false;

            console.error(erro);

            this.alertService.error(
              'Erro ao atualizar produto.'
            );

          }

        });

    } else {

      this.salvandoProduto = true;

      this.alertService.info(
        'Cadastrando produto...'
      );

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

          dataCadastro: '',

        } as Produto)
        .subscribe({

          next: () => {

            this.salvandoProduto = false;

            this.limparFormulario();

            this.carregarProdutos();

            this.alertService.success(
              'Produto cadastrado com sucesso.'
            );

          },
          error: erro => {

            this.salvandoProduto = false;

            console.error(erro);

            this.alertService.error(
              'Erro ao salvar produto.'
            );

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

  get produtosTabela(): unknown[] {

    return this.produtosFiltrados.map(
      produto => ({

        ...produto,

        precoPromocional:
          produto.precoPromocional &&
            produto.precoPromocional > 0
            ? produto.precoPromocional
            : '-',

        status:
          produto.ativo
            ? 'Ativo'
            : 'Inativo'

      })
    );

  }

  novoProduto(): void {

    this.modoVisualizacao = false;

    this.mostrarFormulario = true;

    this.produtoEditandoId = null;

    this.nome = '';

    this.categoria = '';

    this.codigoBarras = '';

    this.precoVenda = 0;

    this.estoqueMinimo = 0;

  }

  cancelarEdicao(): void {

    this.modoVisualizacao = false;

    this.mostrarFormulario = false;

    this.produtoEditandoId = null;

    this.nome = '';

    this.categoria = '';

    this.codigoBarras = '';

    this.precoVenda = 0;

    this.estoqueMinimo = 0;

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

  private limparFormulario(): void {

    this.nome = '';
    this.categoria = '';
    this.codigoBarras = '';
    this.precoVenda = 0;
    this.estoqueMinimo = 0;

    this.produtoEditandoId = null;

    this.estoqueAtual = 0;

    this.dataCadastro = '';

    this.mostrarFormulario = false;

  }

  produtoDeleteIcon(
    produto: Produto
  ): string {

    return produto.ativo
      ? '⏸️'
      : '▶️';

  }

  visualizarProduto(
    produto: unknown
  ): void {

    const produtoSelecionado =
      produto as Produto;

    this.produtoEditandoId =
      produtoSelecionado.id;

    this.nome =
      produtoSelecionado.nome;

    this.categoria =
      produtoSelecionado.categoria;

    this.codigo =
      produtoSelecionado.codigo ?? '';

    this.codigoBarras =
      produtoSelecionado.codigoBarras;

    this.precoVenda =
      produtoSelecionado.precoVenda;

    this.estoqueAtual =
      produtoSelecionado.estoqueAtual;

    this.estoqueMinimo =
      produtoSelecionado.estoqueMinimo;

    this.produtoAtivo =
      produtoSelecionado.ativo;

    this.dataCadastro =
      produtoSelecionado.dataCadastro;

    this.mostrarFormulario = true;

    this.modoVisualizacao = true;

  }

  habilitarEdicao(): void {

    this.modoVisualizacao = false;

  }

  formatarMoeda(
    valor?: number
  ): string {

    if (valor === null || valor === undefined) {
      return '';
    }

    return valor.toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }
    );

  }
}