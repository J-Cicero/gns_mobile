import { Routes } from '@angular/router';
import { OnboardingGuard } from './core/guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'onboarding',
    children: [
      {
        path: 'account-type-selection',
        loadComponent: () => import('./features/onboarding/account-type-selection/account-type-selection.component').then(m => m.AccountTypeSelectionComponent)
      },
      {
        path: 'registration',
        loadComponent: () => import('./features/onboarding/registration/registration.component').then(m => m.RegistrationComponent)
      },
      {
        path: 'academic-enrollment',
        loadComponent: () => import('./features/onboarding/academic-enrollment/academic-enrollment.component').then(m => m.AcademicEnrollmentComponent)
      },
      {
        path: 'eligibility',
        loadComponent: () => import('./features/onboarding/eligibility/eligibility.component').then(m => m.EligibilityComponent)
      }
    ]
  },
  {
    path: 'main',
    canActivate: [OnboardingGuard],
    loadComponent: () => import('./features/main/tabs/tabs.component').then(m => m.TabsComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/main/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'qr',
        loadComponent: () => import('./features/main/qr/qr.component').then(m => m.QrComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./features/main/history/history.component').then(m => m.HistoryComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/main/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'boutiques',
        loadComponent: () => import('./features/main/boutiques-list/boutiques-list.component').then(m => m.BoutiquesListComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
