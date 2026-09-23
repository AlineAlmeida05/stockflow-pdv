export interface UsuarioUpdateRequest {

    nome: string;

    email: string;

    senha?: string;

    perfil: string;

    ativo: boolean;

    tenantId?: string;

}