import { Component, Input } from '@angular/core';
import { DashboardLayout } from '../../../../shared/components/dashboard-layout/dashboard-layout';
import { DashboardChart } from '../../../../shared/components/dashboard-chart/dashboard-chart';
import { DashboardPanel } from '../../../../shared/components/dashboard-panel/dashboard-panel';

@Component({
  selector: 'app-dashboard-financeiro',
  standalone: true,
  imports: [
    DashboardLayout,
    DashboardChart,
    DashboardPanel
  ],
  templateUrl: './dashboard-financeiro.html'
})
export class DashboardFinanceiro {

  @Input({ required: true })
  fiadosChartData: any;

  @Input({ required: true })
  fiadosChartOptions: any;

}