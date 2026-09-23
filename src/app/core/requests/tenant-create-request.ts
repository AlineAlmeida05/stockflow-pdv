export interface TenantCreateRequest {

    nome: string;

    responsavel?: string;

    email?: string;

    cidade?: string;

    ativo: boolean;

    slug?: string;

    codigoTenant?: string;

    logoUrl?: string;

    faviconUrl?: string;

    corPrimaria?: string;

    corSecundaria?: string;

}