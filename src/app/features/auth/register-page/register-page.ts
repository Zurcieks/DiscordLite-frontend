import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  maxLength,
  minLength,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../../core/http/api-error';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../../../core/auth/auth.store';
import { AuthRequest } from '../../../core/auth/auth.models';

type RegisterData = {
  username: string;
  password: string;
  confirmPassword: string;
};

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, FormField],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  protected readonly showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  protected readonly registerData = signal<RegisterData>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly registerForm = form(this.registerData, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required.' });
    minLength(schemaPath.username, 3, { message: 'Username must be at least 3 characters long.' });
    maxLength(schemaPath.username, 30, {
      message: 'Username cannot exceed 30 characters.',
    });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long.' });
    pattern(schemaPath.password, /[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    });
    pattern(schemaPath.password, /[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    });
    pattern(schemaPath.password, /[0-9]/, {
      message: 'Password must contain at least one number.',
    });
    pattern(schemaPath.password, /[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    });
    required(schemaPath.confirmPassword, { message: 'Confirm password is required.' });
    validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);
      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }
      return null;
    });
  });

  onSubmit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.registerForm, async () => {
      const data = this.registerData();

      const request: AuthRequest = {
        username: data.username,
        password: data.password,
      };

      try {
        const response = await firstValueFrom(this.authService.register(request));

        this.authStore.setSession(response);
        await this.router.navigate(['/channels', '@me']);

        return null;
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          const apiError = error.error as ApiError;

          if (apiError.code === 'AUTH_USERNAME_ALREADY_EXISTS') {
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
