import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.StudentLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'scolarite', loadComponent: () => import('./scolarite/scolarite.component').then(m => m.ScolariteComponent) },
      { path: 'reinscription', loadComponent: () => import('./reinscription/reinscription.component').then(m => m.ReinscriptionComponent) },
      { path: 'history', loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];
