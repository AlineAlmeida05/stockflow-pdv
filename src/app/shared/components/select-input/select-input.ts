import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SelectOption = {
    value: string;
    label: string;
};
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
    placeholder = '';

    @Input()
    disabled = false;

    @ViewChild('selectInput')
    selectInput?: ElementRef<HTMLSelectElement>;

    @Input()
    options: SelectOption[] = [];

    @Output()
    valueChange = new EventEmitter<string>();

    @Input()
    size: 'sm' | 'md' | 'lg' = 'md';

    readonly inputId = `select-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

    focar(): void {

        const select = this.selectInput?.nativeElement;

        select?.focus();

    }

}