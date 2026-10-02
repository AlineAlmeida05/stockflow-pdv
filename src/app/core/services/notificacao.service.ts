import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuBadge } from '../models/menu-badge.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificacaoService {

    private readonly apiUrl =
        `${environment.apiUrl}/api/notificacoes`;

    constructor(
        private http: HttpClient
    ) { }

    listarBadges(): Observable<MenuBadge[]> {

        return this.http.get<MenuBadge[]>(
            `${this.apiUrl}/menu`
        );
    }

    private readonly badgesAtualizados =
        new Subject<void>();

    badgesAtualizados$ =
        this.badgesAtualizados.asObservable();

    notificarAtualizacaoBadges(): void {

        this.badgesAtualizados.next();

    }

}