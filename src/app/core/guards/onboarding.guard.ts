import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StudentProfile } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Récupérer le profil étudiant (dans un cas réel via un AuthService)
    const profileStr = localStorage.getItem('student_profile');
    
    if (!profileStr) {
      // Si pas de profil, retour au login
      this.router.navigate(['/auth/login']);
      return false;
    }

    const profile: StudentProfile = JSON.parse(profileStr);

    // Vérifier l'état d'onboarding
    if (!profile.isOnboardingComplete) {
      this.router.navigate(['/onboarding/registration']);
      return false;
    }

    // Si l'onboarding est terminé mais pas éligible
    if (!profile.isEligible) {
      this.router.navigate(['/onboarding/eligibility']);
      return false;
    }

    // Tout est bon, on autorise l'accès à la route demandée (ex: /main/dashboard)
    return true;
  }
}
