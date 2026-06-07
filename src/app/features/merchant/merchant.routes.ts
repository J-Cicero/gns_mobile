import { Routes } from '@angular/router';

export const merchantRoutes: Routes = [
  { path: '', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'caisse', loadComponent: () => import('./caisse/caisse.component').then(m => m.CaisseComponent) },
  { path: 'history', loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent) },
  { path: 'catalogue', loadComponent: () => import('./catalogue/catalogue.component').then(m => m.CatalogueComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) }
];
