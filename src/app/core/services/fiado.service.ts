import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Fiado } from '../models/fiado.model';

@Injectable({
    providedIn: 'root'
})
export class FiadoService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/api/fiados`;

    listar(): Observable<Fiado[]> {

        return this.http.get<Fiado[]>(
            this.apiUrl
        );

    }

}