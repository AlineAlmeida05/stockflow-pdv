import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    templateUrl: './stat-card.html',
    styleUrl: './stat-card.scss'
})
export class StatCard {

    @Input()
    title = '';

    @Input()
    subtitle = '';

    @Input()
    value: string | number | null = '';

    @Input()
    variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';

    @Input()
    active = false;

}