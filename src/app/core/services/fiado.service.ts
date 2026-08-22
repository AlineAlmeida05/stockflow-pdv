import { Injectable } from '@angular/core';
import { Fiado } from '../models/fiado.model';

@Injectable({
    providedIn: 'root'
})
export class FiadoService {

    private readonly STORAGE_KEY =
        'stockflow-fiados';

    private obterFiados(): Fiado[] {

        if (typeof window === 'undefined') {
            return [];
        }

        const dados =
            localStorage.getItem(
                this.STORAGE_KEY
            );

        if (!dados) {
            return [];
        }

        return JSON.parse(dados);

    }

    private salvarFiados(
        fiados: Fiado[]
    ): void {

        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(fiados)
        );

    }

    listar(): Fiado[] {

        return this.obterFiados();

    }

    salvar(
        fiado: Fiado
    ): void {

        const fiados =
            this.obterFiados();

        fiados.push(fiado);

        this.salvarFiados(
            fiados
        );

    }

    buscarPorCliente(
        clienteId: string
    ): Fiado[] {

        return this.obterFiados()
            .filter(
                fiado =>
                    fiado.clienteId === clienteId
            );

    }

    atualizar(
        fiadoAtualizado: Fiado
    ): void {

        const fiados =
            this.obterFiados();

        const indice =
            fiados.findIndex(
                fiado =>
                    fiado.id === fiadoAtualizado.id
            );

        if (indice === -1) {
            return;
        }

        fiados[indice] =
            fiadoAtualizado;

        this.salvarFiados(
            fiados
        );

    }

    removerPorVenda(
        vendaId: string
    ): void {

        const fiados =
            this.obterFiados()
                .filter(
                    fiado =>
                        fiado.vendaId !== vendaId
                );

        this.salvarFiados(
            fiados
        );

    }
}