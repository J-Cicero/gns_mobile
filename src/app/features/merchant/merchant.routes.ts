import { Routes } from '@angular/router';

export const merchantRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.MerchantLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'qr', loadComponent: () => import('./qr/qr.component').then(m => m.QrComponent) },
      { path: 'transactions', loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];
