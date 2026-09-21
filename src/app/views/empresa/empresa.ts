import { Component, OnInit } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { CompanyProfileCard } from './components/company-profile-card/company-profile-card';
import { CompanySupportCard } from './components/company-support-card/company-support-card';
import { Empresa } from '../../core/models/empresa.model';

import { EmpresaService } from '../../core/services/empresa.service';
import { CompanyBrandCard } from './components/company-brand-card/company-brand-card';
import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-empresa',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        CompanyProfileCard,
        CompanySupportCard,
        CompanyBrandCard,
        JsonPipe
    ],
    templateUrl: './empresa.html',
    styleUrl: './empresa.scss'
})

export class EmpresaComponent implements OnInit {

    constructor(
        private empresaService: EmpresaService,
        private cdr: ChangeDetectorRef
    ) { }

    empresa!: Empresa;

    ngOnInit(): void {

        this.empresaService
            .obter()
            .subscribe({

                next: empresa => {

                    this.empresa = empresa;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar empresa',
                        erro
                    );

                }

            });

    }

}