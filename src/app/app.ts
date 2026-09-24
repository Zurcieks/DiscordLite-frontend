import { Component, effect, inject, untracked } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthStore } from './core/auth/auth.store';
import { PresenceService } from './core/presence/presence.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authStore = inject(AuthStore);
  private readonly presenceService = inject(PresenceService);

  constructor() {
    effect(() => {
      const isAuthenticated = this.authStore.isAuthenticated();

      untracked(() => {
        if (isAuthenticated) {
          this.presenceService.start().catch((error) => {
            console.error('[Presence] Nie udało się połączyć:', error);
          });
        } else {
          this.presenceService.stop().catch((error) => {
            console.error('[Presence] Nie udało się zamknąć połączenia:', error);
          });
        }
      });
    });
  }
}
