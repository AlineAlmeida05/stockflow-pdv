import { Component, Input } from '@angular/core';

import { Empresa } from '../../../../core/models/empresa.model';

@Component({
    selector: 'app-company-profile-card',
    standalone: true,
    templateUrl: './company-profile-card.html',
    styleUrl: './company-profile-card.scss'
})
export class CompanyProfileCard {
    @Input()
    empresa!: Empresa;
}