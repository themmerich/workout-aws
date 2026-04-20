import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'location',
    loadChildren: () =>
      import('./domains/location/api/location.routes').then((m) => m.LOCATION_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'location/equipment' },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
