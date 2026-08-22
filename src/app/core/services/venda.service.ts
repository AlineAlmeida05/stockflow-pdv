import { Injectable } from '@angular/core';
import { Venda } from '../models/venda.model';

@Injectable({
    providedIn: 'root'
})

export class VendaService {

    private readonly STORAGE_KEY =
        'stockflow-vendas';

    private obterVendas(): Venda[] {

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

    private salvarVendas(
        vendas: Venda[]
    ): void {

        if (typeof window === 'undefined') {
            return;
        }
        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(vendas)
        );

    }

    listar(): Venda[] {

        return this.obterVendas();

    }

    buscarPorId(
        id: string
    ): Venda | undefined {

        return this.obterVendas()
            .find(venda => venda.id === id);

    }

    salvar(
        venda: Venda
    ): void {

        const vendas =
            this.obterVendas();

        vendas.push(venda);

        this.salvarVendas(
            vendas
        );

    }

    atualizar(
        vendaAtualizada: Venda
    ): void {

        const vendas =
            this.obterVendas();

        const indice =
            vendas.findIndex(
                venda =>
                    venda.id === vendaAtualizada.id
            );

        if (indice === -1) {
            return;
        }

        vendas[indice] =
            vendaAtualizada;

        this.salvarVendas(
            vendas
        );

    }

}