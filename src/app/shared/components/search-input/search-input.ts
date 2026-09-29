import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './search-input.html',
    styleUrl: './search-input.scss'
})
export class SearchInput {

    @Input()
    placeholder = 'Buscar...';

    @Input()
    value = '';

    @Output()
    valueChange = new EventEmitter<string>();

    @ViewChild('searchInput')
    searchInput?: ElementRef<HTMLInputElement>;

    limpar(): void {

        this.valueChange.emit('');

    }

    focar(): void {

        this.searchInput
            ?.nativeElement
            .focus();

        this.searchInput
            ?.nativeElement
            .select();

    }
}