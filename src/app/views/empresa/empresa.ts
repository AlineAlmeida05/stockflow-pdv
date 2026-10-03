import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { Empresa } from '../../core/models/empresa.model';
import { EmpresaService } from '../../core/services/empresa.service';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-empresa',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        SplitPanel,
        DatePipe
    ],
    templateUrl: './empresa.html',
    styleUrl: './empresa.scss'
})

export class EmpresaComponent implements OnInit {

    constructor(
        private empresaService: EmpresaService,
        public tenantContextService: TenantContextService,
        private cd: ChangeDetectorRef
    ) { }

    empresa!: Empresa;

    ngOnInit(): void {

        this.empresaService
            .obter()
            .subscribe({

                next: empresa => {

                    this.empresa = empresa;

                    this.cd.detectChanges();

                },

                error: erro => {

                    console.error(
                        'Erro ao carregar empresa:',
                        erro
                    );

                }

            });

    }

    get tenantAtual() {

        return this
            .tenantContextService
            .tenantAtual;

    }

}