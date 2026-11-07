import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { SplitPanel } from '../../shared/components/split-panel/split-panel';


type ProdutoTabela =
  Omit<Produto, 'precoPromocional'> & {
    status: string;
    precoPromocional: number | '-';
  };

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
    SplitPanel

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

  estoqueMinimo = 0;

  produtoEditandoId: string | null = null;

  estoqueAtual = 0;

  custoMedio = 0;

  dataCadastro = '';

  textoBusca = '';

  mostrarFormulario = false;

  modoVisualizacao = false;

  produtoAtivo = true;

  salvandoProduto = false;

  estoqueInicial = 0;

  precoCompraInicial = 0;

  colunasProdutos: {
    field: string;
    header: string;
    type?: 'text' | 'badge' | 'currency' | 'date' | 'toggle';
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
        header: 'Controle',
        type: 'toggle'
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

          this.produtos = produtos;

          this.cdr.detectChanges();
        },

        error: erro => {

          console.error(
            'Erro ao carregar produtos',
            erro
          );
          this.alertService.error(
            'Erro ao carregar produtos.'
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
      this.estoqueMinimo < 0
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
        'Atualizando produto...'
      );

      this.produtoService
        .atualizar(
          this.produtoEditandoId,
          {
            nome: this.nome,
            categoria: this.categoria,
            codigoBarras: '',
            precoVenda: this.precoVenda,
            estoqueAtual: this.estoqueAtual,
            estoqueMinimo: this.estoqueMinimo,
            ativo: this.produtoAtivo,
            custoMedio: this.custoMedio
          }
        ).subscribe({

          next: () => {

            this.finalizarSucesso(
              'Produto atualizado com sucesso.'
            );

            this.cdr.detectChanges();

          },
          error: erro => {

            this.finalizarErro(
              erro,
              'Erro ao atualizar produto.'
            );

          }

        });

    } else {

      if (
        this.precoCompraInicial <= 0
      ) {

        this.alertService.warning(
          'Informe um preço de compra inicial válido.'
        );

        return;

      }

      this.salvandoProduto = true;

      this.alertService.info(
        'Cadastrando produto...'
      );

      this.produtoService.salvar({

        nome: this.nome,
        categoria: this.categoria,
        precoCompraInicial: this.precoCompraInicial,
        precoVenda: this.precoVenda,
        estoqueMinimo: this.estoqueMinimo,
        estoqueInicial: this.estoqueInicial

      }).subscribe({

        next: () => {

          this.finalizarSucesso(
            'Produto cadastrado com sucesso.'
          );

          this.cdr.detectChanges();

        },
        error: erro => {

          this.finalizarErro(
            erro,
            'Erro ao cadastrar produto.'
          );

        }

      });

    }

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

      message: 'Deseja realmente inativar este produto? O histórico será preservado.',

      type: 'warning',

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

              this.cdr.detectChanges();

            }

          });

      }

    });

  }

  get produtosFiltrados(): Produto[] {

    const busca =
      this.textoBusca
        .toLowerCase();

    return this.produtos.filter(
      produto =>

        produto.nome
          .toLowerCase()
          .includes(busca)

        ||

        produto.codigo
          ?.toLowerCase()
          .includes(busca)
    );

  }

  get produtosTabela(): ProdutoTabela[] {

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

    this.limparFormulario();

    this.mostrarFormulario = true;

    this.modoVisualizacao = false;

    this.precoCompraInicial = 0;

    this.estoqueInicial = 0;

  }

  cancelarEdicao(): void {

    this.limparFormulario();

    this.modoVisualizacao = false;

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

      message: 'Deseja realmente reativar este produto?',

      type: 'info',

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

              this.cdr.detectChanges();

            }

          });

      }

    });

  }

  private limparFormulario(): void {

    this.nome = '';
    this.categoria = '';

    this.precoCompraInicial = 0;
    this.precoVenda = 0;

    this.estoqueInicial = 0;
    this.estoqueMinimo = 0;

    this.produtoEditandoId = null;
    this.estoqueAtual = 0;
    this.dataCadastro = '';

    this.mostrarFormulario = false;

    this.codigo = '';

    this.custoMedio = 0;
  }

  visualizarProduto(
    produto: unknown
  ): void {

    const produtoSelecionado = produto as Produto;

    this.produtoEditandoId = produtoSelecionado.id;

    this.nome = produtoSelecionado.nome;

    this.categoria = produtoSelecionado.categoria;

    this.codigo = produtoSelecionado.codigo ?? '';

    this.precoVenda = produtoSelecionado.precoVenda;

    this.estoqueAtual = produtoSelecionado.estoqueAtual;

    this.estoqueMinimo = produtoSelecionado.estoqueMinimo;

    this.produtoAtivo = produtoSelecionado.ativo;

    this.custoMedio = produtoSelecionado.custoMedio ?? 0;

    this.dataCadastro = produtoSelecionado.dataCadastro;

    this.mostrarFormulario = false;

    this.modoVisualizacao = true;

  }

  habilitarEdicao(): void {

    this.mostrarFormulario = true;

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

  alternarStatusProduto(
    produto: unknown
  ): void {

    const produtoSelecionado = produto as Produto;

    if (!produtoSelecionado.id) {
      return;
    }

    const acao =
      produtoSelecionado.ativo
        ? 'desativar'
        : 'ativar';

    this.confirmDialogService.open({

      title: produtoSelecionado.ativo
        ? 'Desativar Produto'
        : 'Ativar Produto',

      message: produtoSelecionado.ativo
        ? `Deseja realmente desativar o produto "${produtoSelecionado.nome}"?`
        : `Deseja realmente ativar o produto "${produtoSelecionado.nome}"?`,

      type: produtoSelecionado.ativo
        ? 'warning'
        : 'info',

      confirmText: produtoSelecionado.ativo
        ? 'Desativar'
        : 'Ativar',

      cancelText: 'Cancelar',

      onConfirm: () => {

        const loadingToast = this.alertService.loading(
          `${acao === 'ativar'
            ? 'Ativando'
            : 'Desativando'} produto...`
        );

        const request = produtoSelecionado.ativo
          ? this.produtoService.excluir(produtoSelecionado.id)
          : this.produtoService.reativar(produtoSelecionado.id);

        request.subscribe({

          next: () => {

            this.carregarProdutos();

            this.alertService.updateToast(
              loadingToast.id,
              `Produto ${acao === 'ativar'
                ? 'ativado'
                : 'desativado'
              } com sucesso.`,
              'success'
            );

            this.cdr.detectChanges();

          },

          error: erro => {

            this.alertService.updateToast(
              loadingToast.id,
              'Erro ao atualizar produto.',
              'error'
            );

            console.error(erro);
          }


        });

      }

    });

  }

  private finalizarSucesso(
    mensagem: string
  ): void {

    this.salvandoProduto = false;

    this.limparFormulario();

    this.carregarProdutos();

    this.custoMedio = 0;

    this.alertService.success(mensagem);

  }

  private finalizarErro(
    erro: unknown,
    mensagem: string
  ): void {

    this.salvandoProduto = false;

    console.error(erro);

    this.alertService.error(mensagem);

  }
}