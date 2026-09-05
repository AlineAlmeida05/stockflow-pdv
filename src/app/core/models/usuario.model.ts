import { Tenant } from './tenant.model';

export interface Usuario {

    id?: string;

    nome: string;

    email: string;

    senha: string;

    ativo: boolean;

    perfil: string;

    tenant?: Tenant;

}