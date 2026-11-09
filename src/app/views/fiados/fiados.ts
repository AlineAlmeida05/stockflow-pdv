import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Cliente } from '../../core/models/cliente.model';
import { Fiado } from '../../core/models/fiado.model';
import { ClienteService } from '../../core/services/cliente.service';
import { FiadoService } from '../../core/services/fiado.service';
import { Pagamento } from '../../core/models/pagamento.model';
import { PagamentoService } from '../../core/services/pagamento.service';
import { FormsModule } from '@angular/forms';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { AlertService } from '../../core/services/alert.service';
import { CurrencyInput } from '../../shared/components/currency-input/currency-input';
import { ClienteResumo } from '../../core/models/cliente-resumo.model';
import { ActivatedRoute } from '@angular/router';
import { DataTable } from '../../shared/components/data-table/data-table';
import { VendaService } from '../../core/services/venda.service';
import { ExpandableCard } from '../../shared/components/expandable-card/expandable-card';
@Component({
    selector: 'app-fiados',
    standalone: true,
    imports: [
        MainLayout,
        CurrencyPipe,
        FormsModule,
        PageTitle,
        SplitPanel,
        CurrencyInput,
        DataTable,
        ExpandableCard
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

    textoBusca = '';

    clienteResumo?: ClienteResumo;

    mostrarPainel = false;

    private clientePreSelecionadoId?: string;

    movimentoSelecionado: any = null;

    vendas: any[] = [];

    vendaDetalhadaSelecionada: any = null;

    modoPainel:
        'pagamento'
        | 'movimentacao'
        | null = null;

    formaPagamento:
        | 'pix'
        | 'dinheiro'
        | 'debito'
        | 'credito'
        = 'pix';

    colunasExtrato = [
        {
            field: 'dataFormatada',
            header: 'Data'
        },
        {
            field: 'tipoDescricao',
            header: 'Movimentação'
        },
        {
            field: 'valorFormatado',
            header: 'Valor'
        },
        {
            field: 'saldoFormatado',
            header: 'Saldo'
        }
    ];

    constructor(
        private clienteService: ClienteService,
        private fiadoService: FiadoService,
        private pagamentoService: PagamentoService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private vendaService: VendaService

    ) { }

    ngOnInit(): void {

        this.clientePreSelecionadoId =
            this.route.snapshot.queryParamMap
                .get('clienteId') ?? undefined;

        this.carregarDados();

    }

    get saldoDevedorAtual(): number {

        return this.clienteResumo
            ?.saldoDevedor ?? 0;

    }

    visualizarMovimento(
        movimento: any
    ): void {

        this.movimentoSelecionado =
            movimento;

        this.modoPainel =
            'movimentacao';

        this.mostrarPainel =
            true;

        if (
            movimento.tipo === 'fiado'
            &&
            movimento.vendaId
        ) {

            this.vendaService
                .buscarPorId(
                    movimento.vendaId
                )
                .subscribe({

                    next: venda => {

                        this.vendaDetalhadaSelecionada =
                            venda;

                    }

                });

        }

    }


    get diasSemPagamento(): number {

        return this.clienteResumo
            ?.diasSemPagamento ?? 0;

    }

    abrirRecebimento(): void {

        this.mostrarPainel = true;

        this.modoPainel = 'pagamento';

    }

    fecharPainel(): void {

        this.mostrarPainel = false;

        this.modoPainel = null;

        this.movimentoSelecionado = null;

    }

    get statusFinanceiro(): string {

        return this.clienteResumo
            ?.status ?? 'EM_DIA';

    }

    formatarStatusResumo(): string {

        switch (
        this.statusFinanceiro
        ) {

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

    deveExibirAlertaFinanceiroResumo(): boolean {

        const status = this.statusFinanceiro;

        return (
            status === 'INADIMPLENTE'
            ||
            status === 'LIMITE_EXCEDIDO'
        );

    }

    obterResumoCliente(
        clienteId: string
    ): ClienteResumo | undefined {

        return this.resumosClientes[
            clienteId
        ];

    }

    resumosClientes: Record<string, ClienteResumo> = {};

    obterDiasSemPagamento(
        clienteId: string
    ): number {

        return this
            .obterResumoCliente(
                clienteId
            )
            ?.diasSemPagamento ?? 0;

    }


    carregarDados(): void {
        this.clienteService
            .listar()
            .subscribe({

                next: clientes => {

                    this.clientes = clientes;

                    if (
                        this.clientePreSelecionadoId
                    ) {

                        const clienteEncontrado =
                            clientes.find(
                                cliente =>
                                    cliente.id ===
                                    this.clientePreSelecionadoId
                            );

                        if (clienteEncontrado) {

                            this.selecionarCliente(
                                clienteEncontrado
                            );

                        }

                    }

                    clientes.forEach(cliente => {

                        this.clienteService
                            .obterResumo(cliente.id)
                            .subscribe({

                                next: resumo => {

                                    this.resumosClientes[
                                        cliente.id
                                    ] = resumo;

                                    this.cdr.detectChanges();


                                },

                                error: erro => {

                                    console.error(
                                        erro
                                    );

                                }

                            });

                    });

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

                    this.pagamentos = pagamentos;

                    this.cdr.detectChanges();
                }

                ,

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

        this.vendaService
            .listar()
            .subscribe({

                next: vendas => {

                    this.vendas = vendas;

                    this.cdr.detectChanges();

                }

            });

    }

    selecionarCliente(
        cliente: Cliente
    ): void {

        this.cliente = cliente;

        this.mostrarRecebimento = false;

        this.valorRecebido = 0;

        this.clienteService
            .obterResumo(cliente.id)
            .subscribe({

                next: resumo => {

                    this.clienteResumo = resumo;

                    this.cdr.detectChanges();
                },

                error: erro => {

                    console.error(
                        erro
                    );

                }

            });

    }

    obterVendaPorId(
        vendaId: string
    ): any {

        return this.vendas.find(
            venda =>
                venda.id === vendaId
        );

    }

    get clientesDevedores(): Cliente[] {

        return this.clientes
            .filter(cliente => {

                const saldo =
                    this.obterResumoCliente(
                        cliente.id
                    )?.saldoDevedor ?? 0;

                return saldo > 0;

            })
            .sort((a, b) => {

                const saldoA =
                    this.obterResumoCliente(
                        a.id
                    )?.saldoDevedor ?? 0;

                const saldoB =
                    this.obterResumoCliente(
                        b.id
                    )?.saldoDevedor ?? 0;

                return saldoB - saldoA;

            });

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
            this.clienteResumo
                ?.saldoDevedor ?? 0;

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

                    this.cdr.detectChanges();

                    this.alertService.success(
                        'Pagamento registrado com sucesso.'
                    );

                    this.fecharPainel();

                    this.valorRecebido = 0;

                },

                error: erro => {

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

                tipo: 'fiado',

                vendaId: fiado.vendaId

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

    obterItensMovimento(): any[] {

        if (
            !this.movimentoSelecionado
                ?.vendaId
        ) {

            return [];

        }

        const venda =
            this.obterVendaPorId(
                this.movimentoSelecionado
                    .vendaId
            );

        return venda?.itens ?? [];

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

    cobrarViaWhatsapp(
        cliente: Cliente
    ): void {

        if (
            !this.cliente
        ) {
            return;
        }

        const saldo =
            this.clienteResumo
                ?.saldoDevedor ?? 0;

        const dias =
            this.clienteResumo
                ?.diasSemPagamento ?? 0;

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
            this.obterResumoCliente(
                clienteId
            )?.status;

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
            this.obterResumoCliente(
                clienteId
            )?.status;

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

    obterDescricaoMovimento(
        movimento: any
    ): string {

        if (
            movimento.tipo === 'fiado'
        ) {
            return '📒 FIADO';
        }

        switch (
        movimento.formaPagamento
        ) {

            case 'pix':
                return '📱 PIX';

            case 'dinheiro':
                return '💵 DINHEIRO';

            case 'debito':
                return '💳 DÉBITO';

            case 'credito':
                return '💳 CRÉDITO';

            default:
                return '💰 PAGAMENTO';

        }

    }

    get extratoTabela(): unknown[] {

        const movimentos =
            [...this.obterExtratoCliente()]

                .sort(
                    (a, b) =>

                        new Date(a.data).getTime()
                        -
                        new Date(b.data).getTime()
                );

        let saldo = 0;

        const resultado = movimentos.map(
            movimento => {

                if (
                    movimento.tipo === 'fiado'
                ) {

                    saldo += movimento.valor;

                } else {

                    saldo -= movimento.valor;

                }

                return {

                    ...movimento,

                    saldoCalculado: saldo

                };

            }
        );

        return resultado

            .reverse()

            .map(movimento => ({

                ...movimento,

                dataFormatada:
                    new Date(
                        movimento.data
                    )
                        .toLocaleString(
                            'pt-BR'
                        ),

                tipoDescricao:
                    this.obterDescricaoMovimento(
                        movimento
                    ),

                valorFormatado:
                    movimento.tipo === 'fiado'

                        ? `- ${movimento.valor.toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        )}`

                        : `+ ${movimento.valor.toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        )}`,

                saldoFormatado:
                    movimento.saldoCalculado
                        .toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL'
                            }
                        )

            }));

    }

}