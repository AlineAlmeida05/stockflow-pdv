import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { Auditoria } from '../../core/models/auditoria.model';
import { DatePipe } from '@angular/common';
import { PageTitle } from '../../shared/components/page-title/page-title';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { CommonModule } from '@angular/common';
import { Toolbar } from '../../shared/components/toolbar/toolbar';
import { SelectInput } from '../../shared/components/select-input/select-input';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SplitPanel } from '../../shared/components/split-panel/split-panel';
import { DataTable } from '../../shared/components/data-table/data-table';

@Component({
    selector: 'app-auditoria',
    imports: [
        MainLayout,
        CommonModule,
        DatePipe,
        PageTitle,
        Toolbar,
        SelectInput,
        SearchInput,
        EmptyState,
        SplitPanel,
        DataTable
    ],
    templateUrl: './auditoria.html',
    styleUrls: ['./auditoria.scss']
})
export class AuditoriaComponent implements OnInit {

    auditorias: Auditoria[] = [];

    textoBusca = '';

    acaoSelecionada = 'todas';

    periodoSelecionado = 'todos';

    mostrarPainel = false;

    auditoriaSelecionada: Auditoria | null = null;

    entidadeSelecionada = 'todas';

    periodos = [
        {
            label: 'Todos',
            value: 'todos'
        },
        {
            label: 'Hoje',
            value: 'hoje'
        },
        {
            label: '7 Dias',
            value: '7dias'
        },
        {
            label: '30 Dias',
            value: '30dias'
        }
    ];

    entidades = [
        {
            label: 'Todas',
            value: 'todas'
        }
    ];

    colunasAuditoria = [
        {
            field: 'dataFormatada',
            header: 'Data'
        },
        {
            field: 'usuarioNome',
            header: 'Usuário'
        },
        {
            field: 'entidade',
            header: 'Entidade'
        }
    ];

    constructor(
        private auditoriaService: AuditoriaService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.carregarAuditoria();
    }

    carregarAuditoria(): void {
        this.auditoriaService
            .listar()
            .subscribe({
                next: response => {

                    this.auditorias = response;

                    this.carregarEntidades();

                    this.cdr.detectChanges();
                }
            });
    }

    get auditoriasTabela(): unknown[] {

        return this.auditoriasFiltradas.map(
            auditoria => ({

                ...auditoria,

                dataFormatada:
                    new Date(
                        auditoria.dataHora
                    )
                        .toLocaleString(
                            'pt-BR'
                        ),

                acaoFormatada:
                    this.formatarAcao(
                        auditoria.acao
                    )

            })
        );

    }

    visualizarAuditoria(
        auditoria: any
    ): void {

        this.auditoriaSelecionada = auditoria;

        this.mostrarPainel = true;

    }

    fecharPainel(): void {

        this.mostrarPainel = false;

        this.auditoriaSelecionada = null;

    }

    get auditoriasFiltradas(): Auditoria[] {

        return this.auditorias.filter(
            auditoria => {

                const atendeBusca =
                    auditoria.usuarioNome
                        .toLowerCase()
                        .includes(
                            this.textoBusca
                                .toLowerCase()
                        );

                const atendeEntidade = this.entidadeSelecionada === 'todas'
                    ||
                    auditoria.entidade === this.entidadeSelecionada;

                const atendeAcao = this.acaoSelecionada === 'todas'
                    ||
                    auditoria.acao === this.acaoSelecionada;

                const atendePeriodo = this.auditoriaDentroPeriodo(auditoria.dataHora);

                return (
                    atendeBusca
                    &&
                    atendeEntidade
                    &&
                    atendeAcao
                    &&
                    atendePeriodo
                );

            }
        );

    }

    formatarAcao(
        acao: string
    ): string {

        return acao
            .replaceAll('_', ' ')
            .toLowerCase()
            .replace(
                /\b\w/g,
                letra => letra.toUpperCase()
            );

    }

    private carregarEntidades(): void {

        const entidadesUnicas =
            [...new Set(
                this.auditorias.map(
                    auditoria => auditoria.entidade
                )
            )];

        this.entidades = [
            {
                label: 'Todas',
                value: 'todas'
            },
            ...entidadesUnicas.map(
                entidade => ({
                    label: entidade,
                    value: entidade
                })
            )
        ];

    }

    get acoes(): {
        label: string;
        value: string;
    }[] {

        let auditoriasBase = this.auditorias;

        if (
            this.entidadeSelecionada !== 'todas'
        ) {

            auditoriasBase =
                auditoriasBase.filter(
                    auditoria =>
                        auditoria.entidade === this.entidadeSelecionada
                );

        }

        const acoesUnicas =
            [...new Set(
                auditoriasBase.map(
                    auditoria => auditoria.acao
                )
            )];

        return [
            {
                label: 'Todas',
                value: 'todas'
            },
            ...acoesUnicas.map(
                acao => ({
                    label: this.formatarAcao(
                        acao
                    ),
                    value: acao
                })
            )
        ];

    }

    private auditoriaDentroPeriodo(
        dataAuditoria: string
    ): boolean {

        if (
            this.periodoSelecionado ===
            'todos'
        ) {
            return true;
        }

        const hoje = new Date();

        const data = new Date(
            dataAuditoria
        );

        const diferencaDias = Math.floor(
            (
                hoje.getTime()
                -
                data.getTime()
            )
            /
            (
                1000 * 60 * 60 * 24
            )
        );

        if (
            this.periodoSelecionado ===
            'hoje'
        ) {

            return (
                hoje.toDateString()
                ===
                data.toDateString()
            );

        }

        if (
            this.periodoSelecionado ===
            '7dias'
        ) {

            return (
                diferencaDias <= 7
            );

        }

        if (
            this.periodoSelecionado ===
            '30dias'
        ) {

            return (
                diferencaDias <= 30
            );

        }

        return true;

    }

    getClasseAcao(
        acao: string
    ): string {

        if (
            acao.includes('CRIADO')
            || acao.includes('REATIVADO')
            || acao.includes('REALIZADO')
            || acao.includes('ENTRADA')
        ) {
            return 'acao-success';
        }

        if (
            acao.includes('EDITADO')
            || acao.includes('ALTERADA')
        ) {
            return 'acao-warning';
        }

        if (
            acao.includes('INATIVADO')
            || acao.includes('CANCELADA')
        ) {
            return 'acao-danger';
        }

        return '';
    }

}