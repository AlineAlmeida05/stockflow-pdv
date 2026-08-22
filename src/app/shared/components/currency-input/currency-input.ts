import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-currency-input',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './currency-input.html',
    styleUrl: './currency-input.scss'
})
export class CurrencyInput {

    @Input()
    label = '';

    @Input()
    placeholder = '0,00';

    @Input()
    value: number | null = null;

    @Output()
    valueChange =
        new EventEmitter<
            number | null
        >();

}