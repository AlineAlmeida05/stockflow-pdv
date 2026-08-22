import { Component, Input } from '@angular/core';

import { StatCard } from '../stat-card/stat-card';

@Component({
    selector: 'app-stat-card-carousel',
    standalone: true,
    imports: [
        StatCard
    ],
    templateUrl: './stat-card-carousel.html',
    styleUrl: './stat-card-carousel.scss'
})

export class StatCardCarousel {

    @Input()
    cards: {
        title: string;
        value: string | number;
        variant:
            | 'info'
            | 'success'
            | 'warning'
            | 'danger';
    }[] = [];

}