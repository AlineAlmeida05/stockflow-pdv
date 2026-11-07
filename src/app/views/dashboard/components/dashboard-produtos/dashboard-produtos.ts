import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Produto } from '../../../../core/models/produto.model';
import { DashboardLayout } from '../../../../shared/components/dashboard-layout/dashboard-layout';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { DashboardPanel } from '../../../../shared/components/dashboard-panel/dashboard-panel';

@Component({
  selector: 'app-dashboard-produtos',
  standalone: true,
  imports: [
    DashboardLayout,
    EmptyState,
    DashboardPanel
  ],
  templateUrl:
    './dashboard-produtos.html'
})
export class DashboardProdutos {

  @Input({ required: true })
  produtos: Produto[] = [];

  @Input({ required: true })
  produtosSemEstoque: Produto[] = [];

  @Input({ required: true })
  produtosEstoqueBaixo: Produto[] = [];

  @Input({ required: true })
  topProdutosVendidos: any[] = [];

  @Input({ required: true })
  resumoProdutosSelecionado = '';

  @Output()
  resumoProdutosSelecionadoChange = new EventEmitter<string>();

  selecionarResumo(
    valor: string
  ): void {

    this.resumoProdutosSelecionado = valor;

    this.resumoProdutosSelecionadoChange
      .emit(valor);

  }

}