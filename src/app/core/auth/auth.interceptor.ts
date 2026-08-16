import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { RefreshResponse } from './auth.models';

let refreshInFlight: Observable<RefreshResponse> | null = null;

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const accessToken = authStore.state().accessToken;
  const router = inject(Router);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  if (!accessToken) return next(req);

  const newReq = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
  });

  return next(newReq).pipe(
    catchError((error) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      if (!refreshInFlight) {
        refreshInFlight = authService.refresh().pipe(
          catchError((refreshError) => {
            authStore.clear();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          }),
          finalize(() => {
            refreshInFlight = null;
          }),
          shareReplay(1),
        );
      }

      return refreshInFlight.pipe(
        switchMap((response) => {
          authStore.setAccessToken(response.accessToken);

          const retriedRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });
          return next(retriedRequest);
        }),
      );
    }),
  );
}
