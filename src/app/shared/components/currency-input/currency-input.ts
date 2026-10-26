import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-currency-input',
    standalone: true,
    templateUrl: './currency-input.html',
    styleUrl: './currency-input.scss'
})
export class CurrencyInput implements OnInit, OnChanges {

    displayValue = '';

    @Input()
    label = '';

    @Input()
    placeholder = '0,00';

    @Input()
    value: number | null = null;

    @Output()
    valueChange = new EventEmitter<
            number | null
        >();

    protected readonly inputId = crypto.randomUUID();

    ngOnInit(): void {

        this.atualizarDisplay();

    }

    ngOnChanges(

        changes: SimpleChanges

    ): void {

        if (changes['value']) {
            this.atualizarDisplay();
        }

    }

    private atualizarDisplay(): void {

        if (
            this.value === null ||
            this.value === undefined
        ) {

            this.displayValue = '';

            return;

        }
        this.displayValue = this.formatarValor(this.value);

    }

    onInput(
        event: Event
    ): void {

        const input = event.target as HTMLInputElement;

        const numeros = input.value.replace(
                /\D/g,
                ''
            );

        if (!numeros) {

            this.value = null;

            this.displayValue = '';

            this.valueChange.emit(null);

            return;

        }

        const valor = Number(numeros) / 100;

        this.value = valor;

        this.displayValue = this.formatarValor(valor);

        this.valueChange.emit(
            valor
        );

    }

    private formatarValor(
        valor: number
    ): string {

        return valor.toLocaleString(
            'pt-BR',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }

}