import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { AuthRequest } from '../../../core/auth/auth.models';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../../../core/http/api-error';
import { HttpErrorResponse } from '@angular/common/http';

type LoginData = {
  username: string;
  password: string;
};

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, FormField],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  protected readonly showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  protected readonly loginData = signal<LoginData>({
    username: '',
    password: '',
  });

  protected readonly loginForm = form(this.loginData, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required.' });
    required(schemaPath.password, { message: 'Password is required.' });
  });

  onSubmit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.loginForm, async () => {
      const data = this.loginData();

      const request: AuthRequest = {
        username: data.username,
        password: data.password,
      };

      try {
        const response = await firstValueFrom(this.authService.login(request));

        this.authStore.setSession(response);
        await this.router.navigate(['/channels', '@me']);

        return null;
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          const apiError = error.error as ApiError;

          if (apiError.code === 'AUTH_INVALID_CREDENTIALS') {
            return {
              kind: 'server',
              message: apiError.detail,
            };
          }
        }

        return {
          kind: 'server',
          message: 'Something went wrong.',
        };
      }
    });
  }
}
