import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard-response.model';
@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private readonly apiUrl = `${environment.apiUrl}/api/dashboard`;

    constructor(
        private http: HttpClient
    ) {
    }

    obterDashboard(
        periodo: string
    ): Observable<DashboardResponse> {

        return this.http.get<DashboardResponse>(

            `${this.apiUrl}?periodo=${periodo}`

        );

    }

}