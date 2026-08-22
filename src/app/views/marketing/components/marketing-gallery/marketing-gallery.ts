import { Component, OnInit } from '@angular/core';

import { MarketingCampaign } from '../../../../core/models/marketing-campaign.model';

import { MarketingService } from '../../../../core/services/marketing.service';

@Component({
    selector: 'app-marketing-gallery',
    standalone: true,
    templateUrl: './marketing-gallery.html',
    styleUrl: './marketing-gallery.scss'
})
export class MarketingGallery

    implements OnInit {

    campanhas:

        MarketingCampaign[] = [];

    constructor(

        private marketingService:

            MarketingService

    ) { }

    ngOnInit(): void {

        this.campanhas =

            this.marketingService

                .listar();

    }

}