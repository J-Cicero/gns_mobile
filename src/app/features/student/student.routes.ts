import { Routes } from '@angular/router';
import { documentGuard } from '../../core/guards/document.guard';

export const studentRoutes: Routes = [
  { 
    path: 'documents', 
    loadComponent: () => import('./documents/documents.component').then(m => m.DocumentsComponent) 
  },
  { 
    path: 'waiting', 
    loadComponent: () => import('./waiting/waiting.component').then(m => m.WaitingComponent) 
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.StudentLayoutComponent),
    canActivate: [documentGuard],
    children: [
      { path: '', redirectTo: 'wallet', pathMatch: 'full' },
      { 
        path: 'wallet', 
        loadComponent: () => import('./wallet/wallet.component').then(m => m.WalletComponent)
      },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'scolarite', loadComponent: () => import('./scolarite/scolarite.component').then(m => m.ScolariteComponent) },
      { path: 'reinscription', loadComponent: () => import('./reinscription/reinscription.component').then(m => m.ReinscriptionComponent) },
      { path: 'history', loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];
