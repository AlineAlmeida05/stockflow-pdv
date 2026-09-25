import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { Tenant } from '../../core/models/tenant.model';
import { TenantService } from '../../core/services/tenant.service';
import { AuthService } from '../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { UsuarioCreateRequest } from '../../core/requests/usuario-create-request';
import { UsuarioUpdateRequest } from '../../core/requests/usuario-update-request';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [
        CommonModule,
        MainLayout,
        PageTitle,
        DataTable,
        Toolbar,
        SearchInput,
        EmptyState,
        FormsModule,
        SplitPanel,
    ],
    templateUrl: './usuarios.html',
    styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {

    usuarios: Usuario[] = [];

    tenants: Tenant[] = [];

    tenantSelecionadoId = '';

    tenantCadastroId = '';

    usuarioEmEdicao: Usuario | null = null;

    mostrarFormulario = false;

    modoEdicao = false;

    modoVisualizacao = false;

    novoNome = '';

    novoEmail = '';

    novaSenha = '';

    salvando = false;

    novoPerfil = '';

    novoAtivo = true;

    textoBusca = '';


    colunasUsuarios: {
        field: string;
        header: string;
        type?: 'text' | 'badge' | 'currency' | 'date';
    }[] = [
            {
                field: 'nome',
                header: 'Nome'
            },
            {
                field: 'perfil',
                header: 'Perfil',
                type: 'badge'
            },
            {
                field: 'status',
                header: 'Status',
                type: 'badge'
            }
        ];

    constructor(
        private usuarioService: UsuarioService,
        private alertService: AlertService,
        private tenantService: TenantService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.limparFormulario();

        this.carregarTenants();

        this.carregarUsuarios();

    }

    carregarUsuarios(): void {

        const usuario =
            this.authService
                .usuarioLogado();

        if (!usuario) {
            return;
        }

        if (usuario.perfil === 'SUPER_ADMIN') {

            this.usuarioService
                .listar()
                .subscribe({

                    next: usuarios => {

                        this.usuarios = usuarios;

                        this.cdr.detectChanges();

                    },

                    error: erro => {

                        console.error(
                            erro
                        );

                    }

                });

            return;

        }

        this.usuarioService
            .listarPorTenant(
                usuario.tenantId
            )
            .subscribe({

                next: usuarios => {

                    this.usuarios = [...usuarios];

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    get usuariosTabela(): unknown[] {

        return this.usuarios.map(
            usuario => ({

                ...usuario,

                status:
                    usuario.ativo
                        ? 'Ativo'
                        : 'Inativo'

            })
        );

    }

    salvarUsuario(): void {


        let tenant: Tenant | undefined;

        if (this.ehSuperAdmin) {

            tenant =
                this.tenants.find(
                    tenant =>
                        tenant.id ===
                        this.tenantCadastroId
                );

        } else {

            const usuarioLogado =
                this.authService
                    .usuarioLogado();

            tenant =
                this.tenants.find(
                    tenant =>
                        tenant.id ===
                        usuarioLogado?.tenantId
                );

        }

        if (!tenant) {

            this.alertService.error(
                'Selecione um tenant.'
            );

            return;

        }

        if (!tenant.id) {

            this.alertService.error(
                'Tenant inválido.'
            );

            return;

        }

        if (!this.novoNome.trim()) {

            this.alertService.error(
                'Informe o nome do usuário.'
            );

            return;

        }

        if (!this.novoEmail.trim()) {

            this.alertService.error(
                'Informe o e-mail do usuário.'
            );

            return;
        }

        if (
            !this.usuarioEmEdicao &&
            !this.novaSenha.trim()
        ) {

            this.alertService.error(
                'Informe a senha.'
            );

            return;

        }

        if (this.usuarioEmEdicao?.id) {

            this.salvando = true;

            const loadingToast =
                this.alertService.loading(
                    'Atualizando usuário...'
                );

            const request: UsuarioUpdateRequest = {

                nome: this.novoNome,

                email: this.novoEmail,

                senha: this.novaSenha,

                perfil: this.novoPerfil,

                ativo: this.novoAtivo,

                tenantId: tenant.id

            };

            this.usuarioService
                .atualizar(
                    this.usuarioEmEdicao.id,
                    request
                )

                .subscribe({

                    next: () => {

                        this.salvando = false;

                        this.carregarUsuarios();

                        this.limparFormulario();

                        this.alertService.removeToast(
                            loadingToast.id
                        );

                        this.alertService.success(
                            'Usuário atualizado com sucesso.'
                        );

                    },

                    error: erro => {

                        this.salvando = false;

                        this.alertService.removeToast(
                            loadingToast.id
                        );

                        this.alertService.error(
                            'Erro ao atualizar usuário.'
                        );

                        console.error(
                            erro
                        );

                    }

                });

            return;

        }

        this.salvando = true;

        const loadingToast =
            this.alertService.loading(
                'Criando usuário...'
            );

        const request: UsuarioCreateRequest = {

            nome: this.novoNome,
            email: this.novoEmail,
            senha: this.novaSenha,
            perfil: this.novoPerfil,
            tenantId: tenant.id

        };

        this.usuarioService
            .salvar(request)
            .subscribe({

                next: () => {

                    this.salvando = false;

                    this.carregarUsuarios();

                    this.limparFormulario();

                    this.mostrarFormulario = false;

                    this.modoEdicao = false;

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.success(
                        'Usuário criado com sucesso.'
                    );

                },

                error: erro => {

                    this.salvando = false;

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.error(
                        erro.error?.message ??
                        'Erro ao criar usuário.'
                    );

                    console.error(
                        erro
                    );

                }

            });

    }

    excluirUsuario(
        usuario: unknown
    ): void {

        const usuarioSelecionado =
            usuario as Usuario;

        if (!usuarioSelecionado.id) {

            return;

        }

        if (
            !confirm(
                `Deseja realmente desativar o usuário ${usuarioSelecionado.nome}?`
            )
        ) {

            return;

        }

        const loadingToast =
            this.alertService.loading(
                'Desativando usuário...'
            );

        this.usuarioService
            .excluir(
                usuarioSelecionado.id
            )
            .subscribe({

                next: () => {

                    this.carregarUsuarios();

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.success(
                        'Usuário desativado com sucesso.'
                    );

                },

                error: erro => {

                    this.alertService.removeToast(
                        loadingToast.id
                    );

                    this.alertService.error(
                        'Erro ao excluir usuário.'
                    );

                    console.error(
                        erro
                    );

                }

            });

    }

    limparFormulario(): void {

        this.novoNome = '';
        this.novoEmail = '';
        this.novaSenha = '';

        this.novoPerfil = 'GERENTE';

        this.novoAtivo = true;

        this.usuarioEmEdicao = null;

        this.modoEdicao = false;

        this.mostrarFormulario = false;

    }

    editarUsuario(
        usuario: unknown
    ): void {

        const usuarioSelecionado =
            usuario as Usuario;

        this.modoVisualizacao = false;

        this.usuarioEmEdicao = usuarioSelecionado;

        this.novoNome = usuarioSelecionado.nome;

        this.novoEmail = usuarioSelecionado.email;

        this.novaSenha = '';

        this.novoPerfil = usuarioSelecionado.perfil;

        this.novoAtivo = usuarioSelecionado.ativo;

        this.mostrarFormulario = true;

        this.modoEdicao = true;

        this.tenantCadastroId = usuarioSelecionado.tenantId ?? '';

    }

    novoUsuario(): void {

        this.modoVisualizacao = false;

        this.limparFormulario();

        this.mostrarFormulario = true;

        this.modoEdicao = false;


    }

    cancelarEdicao(): void {

        this.modoVisualizacao = false;

        this.mostrarFormulario = false;

        this.modoEdicao = false;

        this.usuarioEmEdicao = null;

        this.limparFormulario();

    }

    get usuariosFiltrados(): unknown[] {

        const filtro =
            this.textoBusca
                .toLowerCase()
                .trim();

        return this.usuariosTabela.filter(

            usuario =>

                !filtro ||

                String(
                    (usuario as any).nome
                )
                    .toLowerCase()
                    .includes(
                        filtro
                    )

        );

    }

    carregarTenants(): void {

        this.tenantService
            .listar()
            .subscribe({

                next: tenants => {

                    this.tenants = tenants;

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    filtrarPorTenant(
        tenantId: string
    ): void {

        this.tenantSelecionadoId =
            tenantId;

        if (!tenantId) {

            this.carregarUsuarios();

            return;

        }

        this.usuarioService
            .listarPorTenant(
                tenantId
            )
            .subscribe({

                next: usuarios => {

                    this.usuarios = usuarios;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    get ehSuperAdmin(): boolean {

        const usuario =
            this.authService.usuarioLogado();

        return usuario?.perfil ===
            'SUPER_ADMIN';

    }

    get perfisDisponiveis(): string[] {

        const perfil =
            this.authService
                .usuarioLogado()
                ?.perfil;

        switch (perfil) {

            case 'SUPER_ADMIN':

                return [
                    'PROPRIETARIO',
                    'SOCIO',
                    'GERENTE',
                    'OPERADOR_CAIXA',
                    'ESTOQUISTA'
                ];

            case 'PROPRIETARIO':

                return [
                    'SOCIO',
                    'GERENTE',
                    'OPERADOR_CAIXA',
                    'ESTOQUISTA'
                ];

            case 'SOCIO':

                return [
                    'GERENTE',
                    'OPERADOR_CAIXA',
                    'ESTOQUISTA'
                ];

            case 'GERENTE':

                return [
                    'OPERADOR_CAIXA',
                    'ESTOQUISTA'
                ];

            default:

                return [];

        }

    }

    visualizarUsuario(
        usuario: unknown
    ): void {

        const usuarioSelecionado =
            usuario as Usuario;

        this.usuarioEmEdicao = usuarioSelecionado;

        this.novoNome = usuarioSelecionado.nome;

        this.novoEmail =usuarioSelecionado.email;

        this.novaSenha = '';

        this.novoPerfil = usuarioSelecionado.perfil;

        this.novoAtivo = usuarioSelecionado.ativo;

        this.mostrarFormulario = true;

        this.modoVisualizacao = true;

        this.tenantCadastroId = usuarioSelecionado.tenantId ?? '';


    }

    obterNomeTenant(
        tenantId?: string
    ): string {

        if (!tenantId) {
            return '';
        }

        const tenant =
            this.tenants.find(
                tenant => tenant.id === tenantId
            );

        return tenant?.nome ?? '';

    }

    habilitarEdicao(): void {

        this.modoVisualizacao = false;

        this.modoEdicao = true;

    }

}