export interface TenantUpdateRequest {

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

    razaoSocial?: string;

    cnpj?: string;

    telefone?: string;

    endereco?: string;

    uf?: string;

    marketingIaHabilitado?: boolean;

    deliveryHabilitado?: boolean;

}