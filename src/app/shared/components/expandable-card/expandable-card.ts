import { Component, Input, EventEmitter, Output } from '@angular/core';

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

    @Output()
    expandedChange =
        new EventEmitter<boolean>();

    @Input()
    collapsible = true;

    @Input()
    icon = '';

    toggle(): void {

        if (!this.collapsible) {
            return;
        }

        this.expanded = !this.expanded;

        this.expandedChange.emit(
            this.expanded
        );

    }

}