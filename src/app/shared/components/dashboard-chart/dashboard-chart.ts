import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Chart, registerables } from 'chart.js';

Chart.register(
    ...registerables
);


@Component({
    selector: 'app-dashboard-chart',
    standalone: true,

    imports: [
        BaseChartDirective,
    ],
    templateUrl:
        './dashboard-chart.html',

    styleUrl:
        './dashboard-chart.scss'
})
export class DashboardChart {

    @Input()
    type:
        'line'
        | 'doughnut'
        | 'bar'
        = 'line';

    @Input()
    chartData: any;

    @Input()
    chartOptions: any;

}