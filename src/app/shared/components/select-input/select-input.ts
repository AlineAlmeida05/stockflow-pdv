import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
    placeholder = '';

    @Input()
    disabled = false;

    @ViewChild('selectInput')
    selectInput?: ElementRef<HTMLSelectElement>;

    @Input()
    options: {
        value: string;
        label: string;
    }[] = [];

    @Output()
    valueChange =
        new EventEmitter<string>();

    @Input()
    size: 'sm' | 'md' | 'lg' = 'md';

    focar(): void {

        this.selectInput
            ?.nativeElement
            .focus();

    }

}