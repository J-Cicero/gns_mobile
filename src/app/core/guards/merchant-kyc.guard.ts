import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MerchantKycGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const profileStr = localStorage.getItem('merchant_profile');
    if (!profileStr) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const profile = JSON.parse(profileStr);
    
    // Si le KYC n'est pas validé
    if (profile.kycStatus !== 'VALIDATED') {
      // Rediriger selon l'état actuel
      if (profile.kycStatus === 'NOT_STARTED' || !profile.isOnboardingComplete) {
        this.router.navigate(['/merchant/onboarding/register']);
      } else {
        this.router.navigate(['/merchant/onboarding/waiting-screen']);
      }
      return false;
    }
    
    return true;
  }
}
