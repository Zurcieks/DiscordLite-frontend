import { Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../../../core/auth/auth.store';
import { UserService } from '../../../core/user/user.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-panel',
  imports: [],
  templateUrl: './user-panel.html',
})
export class UserPanel {
  private readonly authStore = inject(AuthStore);

  protected readonly user = this.authStore.state;

  protected readonly initial = computed(() => this.user().username?.charAt(0).toUpperCase || '?');

  private readonly userService = inject(UserService);

  protected readonly uploading = signal(false);
  protected readonly uploadError = signal<string | null>(null);
  protected readonly uploadSuccess = signal(false);

  protected async onAvatarSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || this.uploading()) {
      return;
    }

    this.uploadError.set(null);
    this.uploadSuccess.set(false);

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.uploadError.set('Wybierz plik PNG lub JPEG');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError.set('Plik moe miec maksymalnie 5 MB');
      input.value = '';
      return;
    }

    this.uploading.set(true);

    try {
      const response = await firstValueFrom(this.userService.uploadAvatar(file));

      this.authStore.setAvatarUrl(response.avatarUrl);
      this.uploadSuccess.set(true);
    } catch (error: unknown) {
      const detail = error instanceof HttpErrorResponse ? error.error?.detail : null;

      this.uploadError.set(
        typeof detail === 'string' ? detail : 'Nie udało się zmienić avatara. Spróbuj ponownie.',
      );
    } finally {
      this.uploading.set(false);
      input.value = '';
    }
  }
}
