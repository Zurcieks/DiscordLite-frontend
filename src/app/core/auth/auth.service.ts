import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthRequest, AuthResponse, RefreshResponse } from './auth.models';
import { environment } from '../../../environments/environment';
import { AuthStore } from './auth.store';
import { finalize, Observable, shareReplay, tap } from 'rxjs';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private refreshInFlight: Observable<RefreshResponse> | null = null;

  refresh(): Observable<RefreshResponse> {
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.http
        .post<RefreshResponse>(`${environment.apiUrl}/auth/refresh`, null)
        .pipe(
          tap((response) => {
            this.authStore.setAccessToken(response.accessToken);
          }),
          finalize(() => {
            this.refreshInFlight = null;
          }),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }

    return this.refreshInFlight;
  }

  register(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request);
  }

  login(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request);
  }

  logout() {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, null);
  }
}
