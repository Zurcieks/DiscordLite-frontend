import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthRequest, AuthResponse, RefreshResponse } from './auth.models';
import { environment } from '../../../environments/environment';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);

  register(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request);
  }

  login(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request);
  }
  refresh() {
    return this.http.post<RefreshResponse>(`${environment.apiUrl}/auth/refresh`, null);
  }
  logout() {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, null);
  }
}
