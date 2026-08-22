import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';

@Component({
    selector: 'app-action-icons',
    standalone: true,
    templateUrl: './action-icons.html',
    styleUrl: './action-icons.scss'
})
export class ActionIcons {

    @Output()
    edit =
        new EventEmitter<void>();

    @Output()
    delete =
        new EventEmitter<void>();

}