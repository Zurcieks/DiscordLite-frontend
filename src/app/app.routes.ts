import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'channels/@me',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register-page/register-page').then((m) => m.RegisterPage),
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page/login-page').then((m) => m.LoginPage),
    canActivate: [guestGuard],
  },
  {
    path: 'channels/@me',
    loadComponent: () =>
      import('./features/channels/channels-me-page/channels-me-page').then((m) => m.ChannelsMePage),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/friendships/friends-page/friends-page').then((m) => m.FriendsPage),
      },
    ],
  },
];
