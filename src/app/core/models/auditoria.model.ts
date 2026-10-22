export interface Auditoria {
    id: string;
    tenantNome: string | null;
    usuarioNome: string;
    acao: string;
    entidade: string;
    entidadeId: string;
    descricao: string;
    dataHora: string;
}