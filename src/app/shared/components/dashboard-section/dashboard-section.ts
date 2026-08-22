import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-dashboard-section',
    standalone: true,
    templateUrl: './dashboard-section.html',
    styleUrl: './dashboard-section.scss'
})
export class DashboardSection {

    @Input()
    title = '';

}