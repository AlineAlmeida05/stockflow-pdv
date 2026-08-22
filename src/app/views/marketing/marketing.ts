import { Component } from '@angular/core';

import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { MarketingCampaignForm } from './components/marketing-campaign-form/marketing-campaign-form';
import { MarketingGeneratedContent } from './components/marketing-generated-content/marketing-generated-content';

import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { MarketingCampaign } from '../../core/models/marketing-campaign.model';

@Component({
    selector: 'app-marketing',
    standalone: true,
    imports: [
        MainLayout,
        PageTitle,
        MarketingCampaignForm,
        MarketingGeneratedContent,
        SplitPanel
    ],
    templateUrl: './marketing.html',
    styleUrl: './marketing.scss'
})

export class Marketing {

    campanhaAtual?: MarketingCampaign;

    atualizarCampanha(
        campanha: MarketingCampaign
    ): void {

        this.campanhaAtual =
            campanha;

    }
}