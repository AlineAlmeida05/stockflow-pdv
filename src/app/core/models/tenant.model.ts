export interface Tenant {

    id?: string;

    nome: string;

    slug?: string;

    codigoTenant?: string;

    email: string;

    telefone?: string;

    ativo: boolean;

    razaoSocial?: string;

    cnpj?: string;

    responsavel?: string;

    endereco?: string;

    cidade?: string;

    uf?: string;

    logoUrl?: string;

    faviconUrl?: string;

    corPrimaria?: string;

    corSecundaria?: string;

    marketingIaHabilitado?: boolean;

    deliveryHabilitado?: boolean;

    criadoEm?: string;

}