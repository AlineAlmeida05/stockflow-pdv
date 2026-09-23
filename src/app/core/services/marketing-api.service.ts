import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketingCampaignRequest } from '../models/marketing-campaign-request.model';
import { MarketingCampaignResponse } from '../models/marketing-campaign-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MarketingApiService {

    private readonly http =
        inject(HttpClient);

    private readonly API =
    `${environment.apiUrl}/api/marketing/campaigns`;

    listar(): Observable<
        MarketingCampaignResponse[]
    > {

        return this.http.get<
            MarketingCampaignResponse[]
        >(this.API);

    }

    gerarCampanha(
        request: MarketingCampaignRequest
    ): Observable<
        MarketingCampaignResponse
    > {

        return this.http.post<
            MarketingCampaignResponse
        >(
            this.API,
            request
        );

    }

}