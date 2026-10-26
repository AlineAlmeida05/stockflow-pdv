import { Component, Input } from '@angular/core';
import { StatCard } from '../stat-card/stat-card';

type StatCardItem = {
    title: string;
    value: string | number;
    variant:
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
};

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
    cards: StatCardItem[] = [];

}