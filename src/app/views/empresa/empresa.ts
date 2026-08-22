import { Component } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { CompanyProfileCard } from './components/company-profile-card/company-profile-card';
import { CompanySupportCard } from './components/company-support-card/company-support-card';
import { Empresa } from '../../core/models/empresa.model';

import { EmpresaService } from '../../core/services/empresa.service';
import { CompanyBrandCard } from './components/company-brand-card/company-brand-card';

@Component({
    selector: 'app-empresa',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        CompanyProfileCard,
        CompanySupportCard,
        CompanyBrandCard
    ],
    templateUrl: './empresa.html',
    styleUrl: './empresa.scss'
})

export class EmpresaComponent {

    constructor(
        private empresaService: EmpresaService
    ) { }


    ngOnInit(): void {

        this.empresa =

            this.empresaService
                .obter();

    }
    empresa!: Empresa;

}