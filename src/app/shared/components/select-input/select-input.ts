import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-select-input',
    standalone: true,

    imports: [
        FormsModule
    ],

    templateUrl: './select-input.html',

    styleUrl: './select-input.scss'
})
export class SelectInput {

    @Input()
    label = '';

    @Input()
    value = '';

    @Input()
    options: {
        value: string;
        label: string;
    }[] = [];

    @Output()
    valueChange =
        new EventEmitter<string>();

}