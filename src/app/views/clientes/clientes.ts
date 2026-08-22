import { Component, OnInit } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';

import { Cliente } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/cliente.service';
import { FormsModule } from '@angular/forms';

import { PageTitle }
    from '../../shared/components/page-title/page-title';
import { SearchInput }
    from '../../shared/components/search-input/search-input';
import { EmptyState }
    from '../../shared/components/empty-state/empty-state';
import { DataTable }
    from '../../shared/components/data-table/data-table';
import { Toolbar }
    from '../../shared/components/toolbar/toolbar';

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
        Toolbar
    ],
    templateUrl: './clientes.html',
    styleUrl: './clientes.scss'
})

export class Clientes implements OnInit {

    nome = '';

    telefone = '';

    clientes: Cliente[] = [];

    clienteEditandoId: string | null = null;

    textoBusca = '';

    mostrarFormulario = false;

    colunasClientes = [
        {
            field: 'nome',
            header: 'Nome'
        },
        {
            field: 'telefone',
            header: 'Telefone'
        }
    ];

    constructor(
        private clienteService: ClienteService
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
        this.clientes =
            this.clienteService.listar();
    }

    salvarCliente(): void {

        if (!this.nome.trim()) {
            return;
        }

        if (this.clienteEditandoId) {

            this.clienteService.atualizar({
                id: this.clienteEditandoId,
                nome: this.nome,
                telefone: this.telefone,
                ativo: true,
                dataCadastro: new Date().toISOString()
            });

        } else {

            this.clienteService.salvar({
                id: crypto.randomUUID(),
                nome: this.nome,
                telefone: this.telefone,
                ativo: true,
                dataCadastro: new Date().toISOString()
            });

        }

        this.nome = '';
        this.telefone = '';
        this.clienteEditandoId = null;
        this.mostrarFormulario = false;

        this.carregarClientes();

    }

    excluirCliente(id: string): void {

        this.clienteService.excluir(id);

        this.carregarClientes();

    }

    editarCliente(cliente: Cliente): void {

        this.mostrarFormulario = true;

        this.clienteEditandoId = cliente.id;

        this.nome = cliente.nome;

        this.telefone = cliente.telefone;

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

        this.excluirCliente(
            (cliente as Cliente).id
        );

    }

    cancelarEdicao(): void {

        this.mostrarFormulario = false;

        this.clienteEditandoId = null;

        this.nome = '';

        this.telefone = '';

    }

    novoCliente(): void {

        this.mostrarFormulario = true;

        this.clienteEditandoId = null;

        this.nome = '';

        this.telefone = '';

    }

}
