import { Routes } from '@angular/router';
import { MerchantKycGuard } from 'src/app/core/guards/merchant-kyc.guard';

export const merchantRoutes: Routes = [
  {
    path: 'onboarding',
    children: [
      { path: 'register', loadComponent: () => import('./onboarding/register/register.component').then(m => m.RegisterComponent) },
      { path: 'kyc-upload', loadComponent: () => import('./onboarding/kyc-upload/kyc-upload.component').then(m => m.KycUploadComponent) },
      { path: 'location-setup', loadComponent: () => import('./onboarding/location-setup/location-setup.component').then(m => m.LocationSetupComponent) },
      { path: 'waiting-screen', loadComponent: () => import('./onboarding/waiting-screen/waiting-screen.component').then(m => m.WaitingScreenComponent) },
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.MerchantLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'caisse', canActivate: [MerchantKycGuard], loadComponent: () => import('./caisse/caisse.component').then(m => m.CaisseComponent) },
      { path: 'finance', canActivate: [MerchantKycGuard], loadComponent: () => import('./finance/finance.component').then(m => m.FinanceComponent) },
      { path: 'catalogue', loadComponent: () => import('./catalogue/catalogue.component').then(m => m.CatalogueComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];
