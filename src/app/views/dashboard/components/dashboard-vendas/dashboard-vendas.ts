import { Component, Input } from '@angular/core';
import { DashboardChart } from '../../../../shared/components/dashboard-chart/dashboard-chart';
import { DashboardLayout } from '../../../../shared/components/dashboard-layout/dashboard-layout';
import { DashboardPanel } from '../../../../shared/components/dashboard-panel/dashboard-panel';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-dashboard-vendas',
  standalone: true,
  imports: [
    DashboardLayout,
    DashboardChart,
    DashboardPanel,
    EmptyState
  ],
  templateUrl: './dashboard-vendas.html',
})
export class DashboardVendas {

  @Input({ required: true })
  pagamentoChartData: any;

  @Input({ required: true })
  pagamentoChartOptions: any;

  @Input({ required: true })
  vendasChartData: any;

  @Input({ required: true })
  vendasChartOptions: any;

}