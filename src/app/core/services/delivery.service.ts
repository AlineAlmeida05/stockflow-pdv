import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResumoDashboardDelivery } from '../models/resumo-dashboard-delivery.model';
import { PedidoDeliveryResumo } from '../models/pedido-delivery-resumo.model';
import { PedidoDeliveryDetalhe } from '../models/pedido-delivery-detalhe.model';
import { CardapioProduto } from '../models/cardapio-produto.model';
import { FormaPagamentoDelivery } from '../models/forma-pagamento-delivery.model';
import { DeliveryEntregasResumo } from '../models/delivery-entregas-resumo.model';

@Injectable({
    providedIn: 'root'
})

export class DeliveryService {

    private readonly apiUrl = `${environment.apiUrl}/delivery`;

    constructor(
        private http: HttpClient
    ) { }

    obterResumo(
        slug: string,
        periodo = 'hoje'
    ): Observable<ResumoDashboardDelivery> {

        return this.http.get<ResumoDashboardDelivery>(
            `${this.apiUrl}/resumo/${slug}?periodo=${periodo}`
        );

    }

    listarPedidos(
        slug: string,
        status?: string,
        periodo = 'hoje'
    ): Observable<PedidoDeliveryResumo[]> {

        let url = `${this.apiUrl}/pedidos/${slug}?periodo=${periodo}`;

        if (status) {

            url += `&status=${status}`;

        }

        return this.http.get<PedidoDeliveryResumo[]>(url);

    }

    buscarPedido(
        slug: string,
        pedidoId: string
    ): Observable<PedidoDeliveryDetalhe> {

        return this.http.get<PedidoDeliveryDetalhe>(
            `${this.apiUrl}/pedidos/${slug}/${pedidoId}`
        );

    }

    atualizarStatus(
        slug: string,
        pedidoId: string,
        status: string
    ): Observable<any> {

        return this.http.patch(
            `${this.apiUrl}/pedidos/${slug}/${pedidoId}/status`,
            {
                status
            }
        );

    }

    listarCardapio(
        slug: string
    ): Observable<CardapioProduto[]> {

        return this.http.get<CardapioProduto[]>(
            `${this.apiUrl}/cardapio/${slug}`
        );

    }

    criarPedido(
        slug: string,
        request: unknown
    ) {

        return this.http.post(
            `${this.apiUrl}/cardapio/${slug}/pedido`,
            request
        );

    }

    obterFormasPagamento(
        slug: string,
        periodo = 'hoje'
    ) {

        return this.http.get<
            FormaPagamentoDelivery[]
        >(
            `${this.apiUrl}/formas-pagamento/${slug}?periodo=${periodo}`
        );

    }

    obterResumoEntregas(
        slug: string,
        periodo = 'hoje'
    ): Observable<DeliveryEntregasResumo> {

        return this.http.get<
            DeliveryEntregasResumo
        >(
            `${this.apiUrl}/entregas/${slug}?periodo=${periodo}`
        );

    }

}