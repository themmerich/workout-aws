import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () => import('./core/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: 'location',
        loadChildren: () =>
          import('./domains/location/api/location.routes').then((m) => m.LOCATION_ROUTES),
      },
      { path: '', pathMatch: 'full', redirectTo: 'location/equipment' },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
