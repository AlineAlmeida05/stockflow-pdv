import { Component, Input } from '@angular/core';

import { Empresa } from '../../../../core/models/empresa.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-company-support-card',
    standalone: true,
    imports: [
        DatePipe,
    ],
    templateUrl: './company-support-card.html',
    styleUrl: './company-support-card.scss'
})
export class CompanySupportCard {
    @Input()
    empresa!: Empresa;
}