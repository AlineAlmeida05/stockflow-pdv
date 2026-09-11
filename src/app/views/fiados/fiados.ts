import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { AlertService } from '../../core/services/alert.service';
import { CurrencyInput } from '../../shared/components/currency-input/currency-input';

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
        SplitPanel,
        CurrencyInput
    ],
    templateUrl: './fiados.html',
    styleUrl: './fiados.scss'
})
export class Fiados implements OnInit {

    clientes: Cliente[] = [];

    fiados: Fiado[] = [];

    cliente?: Cliente;

    pagamentos: Pagamento[] = [];

    mostrarRecebimento = false;

    valorRecebido = 0;

    formaPagamento:
        | 'pix'
        | 'dinheiro'
        | 'debito'
        | 'credito'
        = 'pix';

    textoBusca = '';

    constructor(
        private clienteService: ClienteService,
        private fiadoService: FiadoService,
        private pagamentoService: PagamentoService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.carregarDados();

    }

    carregarDados(): void {
        this.clienteService
            .listar()
            .subscribe({

                next: clientes => {

                    this.clientes = clientes;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

        this.fiadoService

            .listar()

            .subscribe({

                next: fiados => {

                    this.fiados = fiados;

                    this.cdr.detectChanges();

                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

        this.pagamentoService
            .listar()
            .subscribe({

                next: pagamentos => {

                    this.pagamentos =
                        pagamentos;

                    this.cdr.detectChanges();

                }

                ,

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    selecionarCliente(
        cliente: Cliente
    ): void {

        this.cliente = cliente;

        this.mostrarRecebimento = false;

        this.valorRecebido = 0;

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

        if (!this.cliente) {
            return [];
        }

        return this.fiados
            .filter(
                fiado =>
                    fiado.clienteId ===
                    this.cliente?.id
            )
            .sort(
                (a, b) =>
                    new Date(b.dataLancamento).getTime() -
                    new Date(a.dataLancamento).getTime()
            );

    }

    confirmarRecebimento(): void {

        if (
            !this.cliente ||
            this.valorRecebido <= 0
        ) {
            return;
        }


        const saldoAtual =
            this.obterSaldoCliente(
                this.cliente.id
            );

        if (
            this.valorRecebido > saldoAtual
        ) {

            this.alertService.warning(
                'O valor informado excede o saldo devedor.'
            );

            return;

        }

        this.pagamentoService
            .salvar({

                clienteId:
                    this.cliente.id,

                valorPago:
                    this.valorRecebido,

                formaPagamento:
                    this.formaPagamento

            } as any)
            .subscribe({

                next: () => {

                    this.carregarDados();

                    this.valorRecebido = 0;

                    this.formaPagamento = 'pix';

                    this.mostrarRecebimento = false;

                    this.alertService.success(
                        'Pagamento registrado com sucesso.'
                    );

                },

                error: erro => {

                    console.error(
                        erro
                    );

                    this.alertService.error(
                        'Erro ao registrar pagamento.'
                    );

                }

            });
    }

    obterExtratoCliente(): any[] {

        if (!this.cliente) {
            return [];
        }

        const fiados = this.fiados
            .filter(
                fiado =>
                    fiado.clienteId ===
                    this.cliente?.id
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
                    this.cliente?.id
            )
            .map(pagamento => ({
                data: pagamento.dataPagamento,
                valor: pagamento.valorPago,
                tipo: 'pagamento',
                usuarioNome: pagamento.usuarioNome,
                formaPagamento: pagamento.formaPagamento
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

    clienteAcimaDoLimite(
        clienteId: string
    ): boolean {


        const cliente =
            this.clientes.find(
                cliente =>
                    cliente.id === clienteId
            );

        if (!cliente) {
            return false;
        }

        return (
            this.obterSaldoCliente(
                clienteId
            ) > cliente.limiteCredito
        );

    }

    obterDiasEmAberto(
        clienteId: string
    ): number {

        const fiadosCliente =
            this.fiados.filter(
                fiado =>
                    fiado.clienteId === clienteId
            );

        if (fiadosCliente.length === 0) {

            return 0;
        }

        const dataMaisAntiga =
            fiadosCliente
                .map(
                    fiado =>
                        new Date(
                            fiado.dataLancamento
                        )
                )
                .sort(
                    (a, b) =>
                        a.getTime() -
                        b.getTime()
                )[0];

        const hoje =
            new Date();

        const diferencaMs =
            hoje.getTime() -
            dataMaisAntiga.getTime();

        return Math.floor(
            diferencaMs /
            (
                1000 *
                60 *
                60 *
                24
            )
        );
    }

    obterStatusCliente(
        clienteId: string
    ): string {

        const saldo =
            this.obterSaldoCliente(
                clienteId
            );

        const cliente =
            this.clientes.find(
                c =>
                    c.id === clienteId
            );

        if (
            !cliente
        ) {

            return 'EM_DIA';
        }

        if (
            saldo <= 0
        ) {

            return 'EM_DIA';
        }

        if (
            saldo >
            cliente.limiteCredito
        ) {

            return 'LIMITE_EXCEDIDO';
        }

        if (
            this.obterDiasEmAberto(
                clienteId
            ) >= 30
        ) {

            return 'INADIMPLENTE';
        }

        return 'DEVEDOR';
    }

    cobrarViaWhatsapp(
        cliente: Cliente
    ): void {

        if (
            !this.cliente
        ) {
            return;
        }

        const saldo =
            this.obterSaldoCliente(
                this.cliente.id
            );

        const dias =
            this.obterDiasEmAberto(
                this.cliente.id
            );

        const mensagem =

            `Oi ${this.cliente.nome}, tudo bem? 

                Tem um débito seu pendente aqui de R$ ${saldo.toFixed(2)} há ${dias} dias.

                Preciso saber quando voce pretende quitar esse débito.

                Obrigado.`;

        const telefone =
            this.cliente
                .telefone
                .replace(/\D/g, '');

        const url =

            `https://wa.me/55${telefone}?text=${encodeURIComponent(
                mensagem
            )}`;

        window.open(
            url,
            '_blank'
        );
    }

    deveExibirAlertaFinanceiro(
        clienteId: string
    ): boolean {

        const status =
            this.obterStatusCliente(
                clienteId
            );

        return (
            status === 'INADIMPLENTE'
            ||
            status === 'LIMITE_EXCEDIDO'
        );
    }

    formatarStatus(
        clienteId: string
    ): string {

        const status =
            this.obterStatusCliente(
                clienteId
            );

        switch (status) {

            case 'LIMITE_EXCEDIDO':
                return '⚠️ Limite excedido';

            case 'INADIMPLENTE':
                return '🔴 Inadimplente';

            case 'DEVEDOR':
                return '🟠 Devedor';

            default:
                return '';
        }
    }



}