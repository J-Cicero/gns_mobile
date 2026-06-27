import { Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('../history/history.component').then((m) => m.HistoryComponent),
      },
      {
        path: 'qr',
        loadComponent: () => import('../qr/qr.component').then((m) => m.QrComponent),
      },
      {
        path: 'boutiques',
        loadComponent: () => import('../boutiques-list/boutiques-list.component').then((m) => m.BoutiquesListComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
