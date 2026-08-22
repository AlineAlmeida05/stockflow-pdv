import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-dashboard-card',
    standalone: true,
    templateUrl: './dashboard-card.html',
    styleUrl: './dashboard-card.scss'
})
export class DashboardCard {

    @Input()
    title = '';

    @Input()
    value: string | number = '';

    @Input()
    icon = '';

}