import { Component, Input } from '@angular/core';
import { MarketingCampaignResponse } from '../../../../core/models/marketing-campaign-response.model';

@Component({
    selector: 'app-marketing-generated-content',
    standalone: true,
    templateUrl: './marketing-generated-content.html',
    styleUrl: './marketing-generated-content.scss'
})

export class MarketingGeneratedContent {

    constructor(

    ) { }

    @Input()
    campanha?: MarketingCampaignResponse;

    // salvarCampanha(): void {

    //     if (!this.campanha) {

    //         return;

    //     }

    //     this.marketingService
    //         .salvar(
    //             this.campanha
    //         );

    // }


}