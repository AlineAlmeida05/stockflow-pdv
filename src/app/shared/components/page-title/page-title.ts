import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-title',
    standalone: true,
    templateUrl: './page-title.html',
    styleUrl: './page-title.scss'
})
export class PageTitle {

    @Input()
    title = '';

    @Input()
    subtitle = '';

}