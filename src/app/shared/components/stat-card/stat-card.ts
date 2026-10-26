import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    templateUrl: './stat-card.html',
    styleUrl: './stat-card.scss'
})
export class StatCard {

    @Input({ required: true })
    title!: string;

    @Input()
    subtitle = '';

    @Input({ required: true })
    value!: string | number;

    @Input()
    variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';

    @Input()
    active = false;

}