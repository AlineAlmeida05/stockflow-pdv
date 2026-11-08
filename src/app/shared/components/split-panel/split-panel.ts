import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-split-panel',
    standalone: true,
    templateUrl: './split-panel.html',
    styleUrl: './split-panel.scss'
})
export class SplitPanel {

    @Input()
    reverse = false;

    @Input()
    showRight = true;

    @HostBinding('class.with-right')
    get withRight(): boolean {

        return this.showRight;

    }

}