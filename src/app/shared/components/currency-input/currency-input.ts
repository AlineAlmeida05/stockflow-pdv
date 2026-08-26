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

    displayValue = '';

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


    ngOnInit(): void {

        this.atualizarDisplay();

    }

    ngOnChanges(): void {

        this.atualizarDisplay();

    }

    private atualizarDisplay(): void {

        if (
            this.value === null ||
            this.value === undefined
        ) {

            this.displayValue = '';

            return;

        }

        this.displayValue =
            this.value.toLocaleString(
                'pt-BR',
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }

    onInput(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;

        const numeros =
            input.value.replace(
                /\D/g,
                ''
            );

        const valor =
            Number(numeros) / 100;

        this.valueChange.emit(
            valor || null
        );

        this.displayValue =
            valor.toLocaleString(
                'pt-BR',
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }

}