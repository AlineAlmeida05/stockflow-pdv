import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardLayout } from '../../../../shared/components/dashboard-layout/dashboard-layout';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Produto } from '../../../../core/models/produto.model';
import { DashboardPanel } from '../../../../shared/components/dashboard-panel/dashboard-panel';

@Component({
  selector: 'app-dashboard-estoque',
  standalone: true,
  imports: [
    DashboardLayout,
    EmptyState,
    DashboardPanel
  ],
  templateUrl:
    './dashboard-estoque.html'
})
export class DashboardEstoque {

  @Input({ required: true })
  produtos: Produto[] = [];

  @Input({ required: true })
  produtosSemEstoque: Produto[] = [];

  @Input({ required: true })
  produtosEstoqueBaixo: Produto[] = [];

  @Input({ required: true })
  resumoEstoqueSelecionado = '';

  @Output()
  resumoEstoqueSelecionadoChange = new EventEmitter<string>();

  selecionarResumo(
    valor: string
  ): void {

    this.resumoEstoqueSelecionado = valor;

    this.resumoEstoqueSelecionadoChange
      .emit(valor);

  }

}