import { Component, Input } from '@angular/core';
import { MarketingCampaign } from '../../../../core/models/marketing-campaign.model';

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
    campanha?: MarketingCampaign;
    
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