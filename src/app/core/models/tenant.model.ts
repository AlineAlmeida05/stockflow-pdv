export interface Tenant {

    id?: string;

    nome: string;

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

    corPrimaria?: string;

    corSecundaria?: string;

    marketingIaHabilitado?: boolean;

    deliveryHabilitado?: boolean;

    criadoEm?: string;

}