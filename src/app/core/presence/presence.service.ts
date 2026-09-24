import { inject, Service, signal } from '@angular/core';
import { AuthStore } from '../auth/auth.store';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Service()
export class PresenceService {
  private readonly authStore = inject(AuthStore);
  private readonly _onlineFriendIds = signal<ReadonlySet<string>>(new Set<string>());

  readonly onlineFriendIds = this._onlineFriendIds.asReadonly();

  isOnline(userId: string): boolean {
    return this._onlineFriendIds().has(userId);
  }

  private readonly connection: HubConnection = new HubConnectionBuilder()
    .withUrl('/hubs/presence', {
      accessTokenFactory: () => this.authStore.state().accessToken ?? '',
    })
    .withAutomaticReconnect()
    .build();

  constructor() {
    this.connection.on('UserOnline', (userId: string) => {
      this._onlineFriendIds.update((current) => {
        const updated = new Set(current);
        updated.add(userId);

        return updated;
      });
      console.log('[Presence] Znajomy online:', userId);
    });

    this.connection.on('UserOffline', (userId: string) => {
      this._onlineFriendIds.update((current) => {
        const updated = new Set(current);
        updated.delete(userId);

        return updated;
      });
    });
    this.connection.onreconnected((connectionId) => {
      console.log('[Presence] Połączono ponownie:', connectionId);

      this.refreshOnlineFriends().catch((error) => {
        console.error('[Presence] Nie udało się pobrać statusów:', error);
      });
    });

    this.connection.onclose((error) => {
      console.log('[Presence] Połączenie zamknięte:', error);
    });
  }

  async start(): Promise<void> {
    if (!this.authStore.state().accessToken) {
      return;
    }

    if (this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    await this.connection.start();

    console.log('[Presence] Połączono. ConnectionId:', this.connection.connectionId);

    await this.refreshOnlineFriends();
  }

  async stop(): Promise<void> {
    this._onlineFriendIds.set(new Set<string>());
    await this.connection.stop();
  }

  async refreshOnlineFriends(): Promise<void> {
    const userIds = await this.connection.invoke<string[]>('GetOnlineFriends');

    this._onlineFriendIds.set(new Set(userIds));

    console.log('[Presence] Znajomi online:', userIds);
  }
}
