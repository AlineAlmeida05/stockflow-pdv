import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';

import { Cliente } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/cliente.service';
import { FormsModule } from '@angular/forms';

import { PageTitle } from '../../shared/components/page-title/page-title';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { AlertService } from '../../core/services/alert.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';

@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [
        MainLayout,
        FormsModule,
        PageTitle,
        SearchInput,
        EmptyState,
        DataTable,
        Toolbar,
        SplitPanel
    ],
    templateUrl: './clientes.html',
    styleUrl: './clientes.scss'
})

export class Clientes implements OnInit {

    nome = '';

    telefone = '';

    limiteCredito = 300;

    clientes: Cliente[] = [];

    clienteEditandoId: string | null = null;

    textoBusca = '';

    mostrarFormulario = false;

    colunasClientes: {
        field: string;
        header: string;
        type?: 'text' | 'badge' | 'currency' | 'date';
        align?: 'left' | 'center' | 'right';
    }[] = [
            {
                field: 'nome',
                header: 'Nome'
            },
            {
                field: 'telefone',
                header: 'Telefone'
            },
            {
                field: 'limiteCredito',
                header: 'Limite',
                type: 'currency',
                align: 'center'
            },
            {
                field: 'dataCadastro',
                header: 'Cadastro',
                type: 'date',
                align: 'center'
            }
        ];


    constructor(
        private clienteService: ClienteService,
        private alertService: AlertService,
        private confirmDialogService: ConfirmDialogService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.carregarClientes();
    }

    get clientesFiltrados(): Cliente[] {

        return this.clientes.filter(
            cliente =>
                cliente.nome
                    .toLowerCase()
                    .includes(
                        this.textoBusca
                            .toLowerCase()
                    )
        );

    }

    carregarClientes(): void {
        this.clienteService
            .listar()
            .subscribe({

                next: clientes => {

                    this.clientes =
                        clientes;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });
    }

    salvarCliente(): void {

        if (!this.nome.trim()) {

            this.alertService.warning(
                'Informe o nome do cliente.'
            );

            return;

        }

        if (this.clienteEditandoId) {

            const clienteAtual =
                this.clientes.find(
                    cliente =>
                        cliente.id === this.clienteEditandoId
                );

            this.clienteService
                .atualizar({
                    id: this.clienteEditandoId,
                    nome: this.nome,
                    telefone: this.telefone,
                    ativo: true,
                    dataCadastro:
                        clienteAtual?.dataCadastro ??
                        new Date().toISOString(),
                    limiteCredito: this.limiteCredito
                } as Cliente)
                .subscribe({

                    next: () => {

                        this.carregarClientes();

                        this.nome = '';
                        this.telefone = '';
                        this.limiteCredito = 300;
                        this.clienteEditandoId = null;
                        this.mostrarFormulario = false;

                        this.alertService.success(
                            'Cliente atualizado com sucesso.'
                        );

                    },

                    error: erro => {

                        console.error(erro);

                        this.alertService.error(
                            'Erro ao atualizar cliente.'
                        );

                    }

                });

        } else {

            this.clienteService
                .salvar({
                    id: crypto.randomUUID(),
                    nome: this.nome,
                    telefone: this.telefone,
                    ativo: true,
                    dataCadastro: new Date().toISOString(),
                    limiteCredito: this.limiteCredito
                } as Cliente)
                .subscribe({

                    next: () => {

                        this.carregarClientes();

                        this.nome = '';
                        this.telefone = '';
                        this.limiteCredito = 300;
                        this.clienteEditandoId = null;
                        this.mostrarFormulario = false;

                        this.alertService.success(
                            'Cliente cadastrado com sucesso.'
                        );

                    },

                    error: erro => {

                        console.error(erro);

                        this.alertService.error(
                            'Erro ao cadastrar cliente.'
                        );

                    }

                });

        }      

    }

    excluirCliente(id: string): void {

        this.clienteService
            .excluir(id)
            .subscribe({

                next: () => {

                    this.carregarClientes();

                    this.alertService.success(
                        'Cliente excluído com sucesso.'
                    );

                },

                error: erro => {

                    console.error(erro);

                    this.alertService.error(
                        'Erro ao excluir cliente.'
                    );

                }

            });
    }

    editarCliente(cliente: Cliente): void {

        this.mostrarFormulario = true;

        this.clienteEditandoId = cliente.id;

        this.nome = cliente.nome;

        this.telefone = cliente.telefone;

        this.limiteCredito = cliente.limiteCredito;
    }

    editarClienteTabela(
        cliente: unknown
    ): void {

        this.editarCliente(
            cliente as Cliente
        );

    }

    excluirClienteTabela(
        cliente: unknown
    ): void {

        this.confirmarExclusaoCliente(
            cliente as Cliente
        );

    }

    cancelarEdicao(): void {

        this.mostrarFormulario = false;

        this.clienteEditandoId = null;

        this.nome = '';

        this.telefone = '';

        this.limiteCredito = 300;

    }

    novoCliente(): void {

        this.mostrarFormulario = true;

        this.clienteEditandoId = null;

        this.nome = '';

        this.telefone = '';

        this.limiteCredito = 300;

    }

    confirmarExclusaoCliente(
        cliente: Cliente
    ): void {

        this.confirmDialogService.open({

            title: 'Excluir Cliente',

            message:
                `Deseja realmente excluir o cliente "${cliente.nome}"?`,

            type: 'danger',

            confirmText: 'Excluir',

            onConfirm: () => {

                this.excluirCliente(cliente.id);

            }

        });

    }
}
