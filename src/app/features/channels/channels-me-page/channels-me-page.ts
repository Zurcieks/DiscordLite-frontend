import { Component, computed, inject } from '@angular/core';
import { AuthStore } from '../../../core/auth/auth.store';
import { ServerSidebar } from '../server-sidebar/server-sidebar';
import { DmSidebar } from '../dm-sidebar/dm-sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-channels-me-page',
  imports: [ServerSidebar, DmSidebar, RouterOutlet],
  templateUrl: './channels-me-page.html',
  styleUrl: './channels-me-page.css',
})
export class ChannelsMePage {
  private readonly authStore = inject(AuthStore);

  readonly userSummary = computed(() => {
    const state = this.authStore.state();
    return {
      username: state.username,
      avatarUrl: state.avatarUrl,
    };
  });
}
