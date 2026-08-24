import {
    Component,
    Input
} from '@angular/core';

@Component({
    selector: 'app-expandable-card',
    standalone: true,
    templateUrl: './expandable-card.html',
    styleUrl: './expandable-card.scss'
})
export class ExpandableCard {

    @Input()
    title = '';

    @Input()
    expanded = false;

    toggle(): void {

        this.expanded =
            !this.expanded;

    }

}