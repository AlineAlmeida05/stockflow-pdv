import {
    Component,
    EventEmitter,
    Output,
    Input
} from '@angular/core';

@Component({
    selector: 'app-action-icons',
    standalone: true,
    templateUrl: './action-icons.html',
    styleUrl: './action-icons.scss'
})
export class ActionIcons {

    @Input()
    showEdit = true;

    @Output()
    edit = new EventEmitter<void>();

    @Output()
    delete = new EventEmitter<void>();   


}