import { Routes } from '@angular/router';

export const merchantRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.MerchantLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'caisse', loadComponent: () => import('./caisse/caisse.component').then(m => m.CaisseComponent) },
      { path: 'finance', loadComponent: () => import('./finance/finance.component').then(m => m.FinanceComponent) },
      { path: 'catalogue', loadComponent: () => import('./catalogue/catalogue.component').then(m => m.CatalogueComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];
