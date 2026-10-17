
import { DashboardChart } from './dashboard-chart';

describe('DashboardChart', () => {

  let component: DashboardChart;

  beforeEach(() => {
    component = new DashboardChart();
  });

  it('deve ser criado', () => {

    expect(component).toBeTruthy();

  });

  it('deve iniciar com type line', () => {

    expect(component.type)
      .toBe('line');

  });

  it('deve permitir definir chartData', () => {

    component.chartData = {
      labels: ['Jan'],
      datasets: [
        {
          data: [10]
        }
      ]
    };

    expect(component.chartData.labels)
      .toEqual(['Jan']);

  });

  it('deve permitir definir chartOptions', () => {

    component.chartOptions = {
      responsive: true
    };

    expect(
      component.chartOptions?.responsive
    ).toBe(true);

  });

});