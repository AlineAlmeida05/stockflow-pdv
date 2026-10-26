import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { Router } from '@angular/router';

export const authRefreshInterceptor:

    HttpInterceptorFn = (req, next) => {

        const authService = inject(AuthService);

        const router = inject(Router);

        return next(req).pipe(

            catchError(
                (error: HttpErrorResponse) => {

                    if (
                        error.status !== 401
                    ) {

                        return throwError(
                            () => error
                        );

                    }

                    if (
                        req.url.includes('/auth/refresh')
                    ) {

                        authService.limparSessao();

                        router.navigate([
                            '/stockflowpdv/login'
                        ]);

                        return throwError(
                            () => error
                        );

                    }

                    return authService
                        .refreshToken()
                        .pipe(

                            switchMap(
                                response => {

                                    localStorage.setItem(
                                        STORAGE_KEYS.TOKEN,
                                        response.token
                                    );

                                    const cloned =
                                        req.clone({
                                            setHeaders: {
                                                Authorization:
                                                    `Bearer ${response.token}`
                                            }
                                        });

                                    return next(cloned);

                                }
                            ),

                            catchError(refreshError => {

                                authService.limparSessao();

                                router.navigate([
                                    '/stockflowpdv/login'
                                ]);

                                return throwError(
                                    () => refreshError
                                );

                            })

                        );

                }
            )

        );

    };