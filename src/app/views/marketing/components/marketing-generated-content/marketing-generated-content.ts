import { Component, Input } from '@angular/core';
import { MarketingCampaign } from '../../../../core/models/marketing-campaign.model';
import { MarketingService } from '../../../../core/services/marketing.service';
import html2canvas from 'html2canvas';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-marketing-generated-content',
    standalone: true,
    templateUrl: './marketing-generated-content.html',
    styleUrl: './marketing-generated-content.scss'
})
export class MarketingGeneratedContent {

    constructor(
        private marketingService:
            MarketingService
    ) { }

    @Input()
    campanha?: MarketingCampaign;

    @ViewChild('artPreview')
    artPreview?: ElementRef;

    copiarTexto(): void {

        if (!this.campanha) {

            return;

        }

        const texto = `
            ${this.campanha.headline}

            ${this.campanha.cta}
            `;

        navigator.clipboard.writeText(
            texto
        );

    }

    salvarCampanha(): void {

        if (!this.campanha) {

            return;

        }

        this.marketingService
            .salvar(
                this.campanha
            );

    }

    baixarArte(): void {

        if (!this.artPreview) {

            return;

        }

        html2canvas(
            this.artPreview.nativeElement
        ).then(canvas => {

            const link =
                document.createElement('a');

            link.download =
                'campanha.png';

            link.href =
                canvas.toDataURL(
                    'image/png'
                );

            link.click();

        });

    }
}