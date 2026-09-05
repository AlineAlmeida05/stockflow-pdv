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
import { TenantContextService } from '../../core/services/tenant-context.service';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';


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

    usuarioEmEdicao: Usuario | null = null;

    mostrarFormulario = false;

    modoEdicao = false;

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
                field: 'email',
                header: 'Email'
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
        private tenantContextService: TenantContextService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {

        this.carregarUsuarios();

        this.limparFormulario();

    }

    carregarUsuarios(): void {

        this.usuarioService
            .listar()
            .subscribe({

                next: usuarios => {

                    this.usuarios =
                        usuarios;

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


        const tenant =
            this.tenantContextService
                .tenantAtual;

        if (!tenant) {

            this.alertService.error(
                'Nenhum tenant selecionado.'
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

            this.usuarioService
                .atualizar(
                    this.usuarioEmEdicao.id,
                    {
                        ...this.usuarioEmEdicao,

                        nome: this.novoNome,
                        email: this.novoEmail,
                        senha: this.novaSenha,
                        perfil: this.novoPerfil,
                        ativo: this.novoAtivo
                    }
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

        this.usuarioService
            .salvar({

                nome: this.novoNome,

                email: this.novoEmail,

                senha: this.novaSenha,

                perfil: this.novoPerfil,

                ativo: this.novoAtivo,

                tenant


            })

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
                `Deseja realmente excluir o usuário ${usuarioSelecionado.nome}?`
            )
        ) {

            return;

        }

        const loadingToast =
            this.alertService.loading(
                'Excluindo usuário...'
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
                        'Usuário excluído com sucesso.'
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

        this.usuarioEmEdicao = usuarioSelecionado;

        this.novoNome = usuarioSelecionado.nome;

        this.novoEmail = usuarioSelecionado.email;

        this.novaSenha = '';

        this.novoPerfil = usuarioSelecionado.perfil;

        this.novoAtivo = usuarioSelecionado.ativo;

        this.mostrarFormulario = true;

        this.modoEdicao = true;

    }

    novoUsuario(): void {

        this.limparFormulario();

        this.mostrarFormulario = true;

        this.modoEdicao = false;


    }

    cancelarEdicao(): void {

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
}