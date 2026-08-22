import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { MainLayout } from '../../layout/main-layout/main-layout';

import { Cliente } from '../../core/models/cliente.model';
import { Fiado } from '../../core/models/fiado.model';

import { ClienteService } from '../../core/services/cliente.service';
import { FiadoService } from '../../core/services/fiado.service';

import { Pagamento } from '../../core/models/pagamento.model';
import { PagamentoService } from '../../core/services/pagamento.service';
import { FormsModule } from '@angular/forms';

import { PageTitle }
    from '../../shared/components/page-title/page-title';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

import { SplitPanel }
    from '../../shared/components/split-panel/split-panel';

@Component({
    selector: 'app-fiados',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        DatePipe,
        FormsModule,
        PageTitle,
        SearchInput,
        EmptyState,
        SplitPanel
    ],
    templateUrl: './fiados.html',
    styleUrl: './fiados.scss'
})
export class Fiados implements OnInit {

    clientes: Cliente[] = [];

    fiados: Fiado[] = [];

    clienteSelecionado?: Cliente;

    pagamentos: Pagamento[] = [];

    mostrarRecebimento = false;

    valorRecebido = 0;

    textoBusca = '';
    
    constructor(
        private clienteService: ClienteService,
        private fiadoService: FiadoService,
        private pagamentoService: PagamentoService
    ) { }

    ngOnInit(): void {

        this.carregarDados();

        console.log('CLIENTES', this.clientes);

        console.log('FIADOS', this.fiados);

    }

    carregarDados(): void {

        this.clientes =
            this.clienteService.listar();

        this.fiados =
            this.fiadoService.listar();

        this.pagamentos =
            this.pagamentoService.listar();

    }

    selecionarCliente(
        cliente: Cliente
    ): void {

        this.clienteSelecionado =
            cliente;

    }

    obterSaldoCliente(
        clienteId: string
    ): number {

        const totalFiados =
            this.fiados
                .filter(
                    fiado =>
                        fiado.clienteId === clienteId
                )
                .reduce(
                    (total, fiado) =>
                        total + fiado.valorTotal,
                    0
                );

        const totalPagamentos =
            this.pagamentos
                .filter(
                    pagamento =>
                        pagamento.clienteId === clienteId
                )
                .reduce(
                    (total, pagamento) =>
                        total + pagamento.valorPago,
                    0
                );

        return Number(
            (totalFiados - totalPagamentos)
                .toFixed(2)
        );

    }

    get clientesDevedores(): Cliente[] {

        console.log(

            this.clientes.map(cliente => ({

                nome: cliente.nome,

                saldo: this.obterSaldoCliente(cliente.id)
            }))
        );

        return this.clientes
            .filter(
                cliente =>
                    this.obterSaldoCliente(
                        cliente.id
                    ) > 0
            )
            .sort(
                (a, b) =>
                    this.obterSaldoCliente(b.id) -
                    this.obterSaldoCliente(a.id)
            );

    }

    obterFiadosCliente(): Fiado[] {

        if (!this.clienteSelecionado) {
            return [];
        }

        return this.fiados
            .filter(
                fiado =>
                    fiado.clienteId ===
                    this.clienteSelecionado?.id
            )
            .sort(
                (a, b) =>
                    new Date(b.dataLancamento).getTime() -
                    new Date(a.dataLancamento).getTime()
            );

    }

    confirmarRecebimento(): void {

        if (
            !this.clienteSelecionado ||
            this.valorRecebido <= 0
        ) {
            return;
        }


        const saldoAtual =
            this.obterSaldoCliente(
                this.clienteSelecionado.id
            );

        if (
            this.valorRecebido > saldoAtual
        ) {

            alert(
                'O valor recebido não pode ser maior que o saldo devedor.'
            );

            return;

        }

        this.pagamentoService.salvar({

            id: crypto.randomUUID(),

            clienteId:
                this.clienteSelecionado.id,

            clienteNome:
                this.clienteSelecionado.nome,

            valorPago:
                this.valorRecebido,

            dataPagamento:
                new Date().toISOString()

        });

        this.pagamentos =
            this.pagamentoService.listar();

        this.valorRecebido = 0;

        this.mostrarRecebimento = false;

        alert(
            'Pagamento registrado com sucesso.'
        );

    }

    obterExtratoCliente(): any[] {

        if (!this.clienteSelecionado) {
            return [];
        }

        const fiados = this.fiados
            .filter(
                fiado =>
                    fiado.clienteId ===
                    this.clienteSelecionado?.id
            )
            .map(fiado => ({
                data: fiado.dataLancamento,
                valor: fiado.valorTotal,
                tipo: 'fiado'
            }));

        const pagamentos = this.pagamentos
            .filter(
                pagamento =>
                    pagamento.clienteId ===
                    this.clienteSelecionado?.id
            )
            .map(pagamento => ({
                data: pagamento.dataPagamento,
                valor: pagamento.valorPago,
                tipo: 'pagamento'
            }));

        return [...fiados, ...pagamentos]
            .sort(
                (a, b) =>
                    new Date(b.data).getTime() -
                    new Date(a.data).getTime()
            );

    }

    get clientesDevedoresFiltrados(): Cliente[] {

        return this.clientesDevedores.filter(
            cliente =>
                cliente.nome
                    .toLowerCase()
                    .includes(
                        this.textoBusca
                            .toLowerCase()
                    )
        );

    }
    
}