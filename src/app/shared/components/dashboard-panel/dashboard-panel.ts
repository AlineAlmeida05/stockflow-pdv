import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  templateUrl: './dashboard-panel.html',
  styleUrl: './dashboard-panel.scss'
})
export class DashboardPanel {

  @Input()
  title = '';

}