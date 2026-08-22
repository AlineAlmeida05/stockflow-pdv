import { Injectable } from '@angular/core';

import { MarketingCampaign } from '../models/marketing-campaign.model';

@Injectable({
    providedIn: 'root'
})

export class MarketingService {

    private readonly STORAGE_KEY =

        'marketing-campaigns';

    listar(): MarketingCampaign[] {

        const dados =

            localStorage.getItem(

                this.STORAGE_KEY

            );

        return dados

            ? JSON.parse(dados)

            : [];

    }

    salvar(

        campanha: MarketingCampaign

    ): void {

        const campanhas =

            this.listar();

        campanhas.unshift(

            campanha

        );

        localStorage.setItem(

            this.STORAGE_KEY,

            JSON.stringify(

                campanhas

            )

        );

    }

    excluir(
        dataCriacao: string
    ): void {

        const campanhas =
            this.listar().filter(
                campanha =>
                    campanha.dataCriacao !==
                    dataCriacao
            );

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(
                campanhas
            )
        );

    }

}