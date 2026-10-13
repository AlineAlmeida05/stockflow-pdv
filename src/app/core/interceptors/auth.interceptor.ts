import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';



export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

    const authService =
        inject(AuthService);

    const token =
        localStorage.getItem(
            'token'
        );

    let request = req;

    if (token) {

        request =
            req.clone({
                setHeaders: {
                    Authorization:
                        `Bearer ${token}`
                }
            });

    }

    return next(request).pipe(

        catchError(error => {

            if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                !req.url.includes('/auth/refresh')
            ) {

                return authService
                    .refresh()
                    .pipe(

                        switchMap(response => {

                            localStorage.setItem(
                                'token',
                                response.token
                            );

                            const novaRequest =
                                req.clone({
                                    setHeaders: {
                                        Authorization:
                                            `Bearer ${response.token}`
                                    }
                                });

                            return next(
                                novaRequest
                            );

                        }),
                        catchError(error => {

                            localStorage.removeItem(
                                'token'
                            );

                            window.location.href =
                                '/login';

                            return throwError(
                                () => error
                            );

                        })


                    );

            }

            return throwError(
                () => error
            );

        })

    );

};