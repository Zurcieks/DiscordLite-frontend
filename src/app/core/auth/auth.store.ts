import { computed, Service, signal } from '@angular/core';

type AuthState = {
  userId: string | null;
  username: string | null;
  avatarUrl: string | null;
  accessToken: string | null;
};

@Service()
export class AuthStore {
  private readonly _state = signal<AuthState>({
    userId: null,
    username: null,
    avatarUrl: null,
    accessToken: null,
  });

  readonly state = this._state.asReadonly();
  readonly isAuthenticated = computed(() => this._state().accessToken !== null);

  setSession(authState: AuthState) {
    this._state.set(authState);
  }
  setAccessToken(token: string) {
    this._state.update((currentState) => {
      return {
        ...currentState,
        accessToken: token,
      };
    });
  }

  setAvatarUrl(avatarUrl: string | null): void {
    this._state.update((current) => ({
      ...current,
      avatarUrl,
    }));
  }

  clear() {
    this._state.set({
      userId: null,
      username: null,
      avatarUrl: null,
      accessToken: null,
    });
  }
}
