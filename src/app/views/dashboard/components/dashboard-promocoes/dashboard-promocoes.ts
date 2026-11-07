import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DashboardLayout } from '../../../../shared/components/dashboard-layout/dashboard-layout';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { DashboardPanel } from '../../../../shared/components/dashboard-panel/dashboard-panel';

@Component({
  selector: 'app-dashboard-promocoes',
  standalone: true,
  imports: [
    DashboardLayout,
    EmptyState,
    CurrencyPipe,
    DashboardPanel
  ],
  templateUrl: './dashboard-promocoes.html'
})
export class DashboardPromocoes {

  @Input({ required: true })
  resumoPromocoesSelecionado = '';

  @Input({ required: true })
  totalPromocoesAtivas = 0;

  @Input({ required: true })
  totalVendasPromocionais = 0;

  @Input({ required: true })
  faturamentoPromocional = 0;

  @Input({ required: true })
  totalPromocoesEficientes = 0;

  @Input({ required: true })
  promocoesAtivasDetalhes: any[] = [];

  @Input({ required: true })
  produtosPromocionaisMaisVendidos: any[] = [];

  @Input({ required: true })
  promocoesEficientes: any[] = [];

  @Output()
  resumoPromocoesSelecionadoChange = new EventEmitter<string>();

  selecionarResumo(
    valor: string
  ): void {

    this.resumoPromocoesSelecionado = valor;

    this.resumoPromocoesSelecionadoChange.emit(
      valor
    );

  }

}