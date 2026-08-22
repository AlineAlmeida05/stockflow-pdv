import { Injectable } from '@angular/core';

import { Empresa } from '../models/empresa.model';
import { COMPANY_CONFIG } from '../../config/company.config';
import { BRANDING_CONFIG } from '../../config/branding.config';
import { SYSTEM_CONFIG } from '../../config/system.config';

@Injectable({
    providedIn: 'root'
})

export class EmpresaService {

    private readonly STORAGE_KEY =
        'empresa';

    obter(): Empresa {

        const dados =
            localStorage.getItem(
                this.STORAGE_KEY
            );

        if (dados) {

            return JSON.parse(dados);

        }

        return {

            nomeFantasia: COMPANY_CONFIG.nomeFantasia,

            razaoSocial: COMPANY_CONFIG.razaoSocial,

            proprietario: COMPANY_CONFIG.proprietario,

            cnpj: COMPANY_CONFIG.cnpj,

            telefone: COMPANY_CONFIG.telefone,

            email: COMPANY_CONFIG.email,

            endereco: COMPANY_CONFIG.endereco,

            cidade: COMPANY_CONFIG.cidade,

            uf: COMPANY_CONFIG.uf,

            logoUrl: BRANDING_CONFIG.logo,

            slogan: BRANDING_CONFIG.slogan,

            versaoSistema: SYSTEM_CONFIG.versaoSistema,

            corPrimaria: BRANDING_CONFIG.cores.primaria,

            corSecundaria: BRANDING_CONFIG.cores.secundaria,

            dataImplantacao: new Date().toISOString()

        };

    }

    salvar(
        empresa: Empresa
    ): void {

        localStorage.setItem(

            this.STORAGE_KEY,

            JSON.stringify(
                empresa
            )

        );

    }

}