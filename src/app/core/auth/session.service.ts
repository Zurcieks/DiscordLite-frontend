import { inject, Service, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthStore } from './auth.store';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class SessionService {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly _logoutError = signal<string | null>(null);
  readonly logoutError = this._logoutError.asReadonly();

  async restoreSession() {
    try {
      const refreshResponse = await firstValueFrom(this.authService.refresh());

      const token = refreshResponse.accessToken;
      this.authStore.setAccessToken(token);

      const profile = await firstValueFrom(this.userService.getMyProfile());

      this.authStore.setSession({
        userId: profile.userId,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        accessToken: token,
      });
    } catch {
      this.authStore.clear();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this._logoutError.set(null);
        this.authStore.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        this._logoutError.set('Could not log out. Try again.');
      },
    });
  }
}
