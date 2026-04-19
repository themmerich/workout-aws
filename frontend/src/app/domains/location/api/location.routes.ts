import { Routes } from '@angular/router';

export const LOCATION_ROUTES: Routes = [
  {
    path: 'equipment',
    loadComponent: () => import('../feat-equipment/equipment-page').then((m) => m.EquipmentPage),
  },
];
