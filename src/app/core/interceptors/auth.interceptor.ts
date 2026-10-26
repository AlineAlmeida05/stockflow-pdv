import { HttpInterceptorFn } from '@angular/common/http';
import { STORAGE_KEYS } from '../constants/storage.constants';

export const authInterceptor:
    HttpInterceptorFn =
    (req, next) => {

        if (
            req.url.includes('/auth/refresh')
        ) {

            return next(req);

        }

        const token = localStorage.getItem(
            STORAGE_KEYS.TOKEN
        );

        if (!token) {
            return next(req);
        }

        const request =
            req.clone({
                setHeaders: {
                    Authorization:
                        `Bearer ${token}`
                }
            });

        return next(request);

    };