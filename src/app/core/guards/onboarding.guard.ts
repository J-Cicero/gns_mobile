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

    if (profile.statutKYC === 'VALIDATED' || profile.isOnboardingComplete) {
      return true;
    }

    // Sinon, on redirige vers l'évaluation pour qu'il trouve la bonne page
    this.router.navigate(['/auth/login']);
    return false;
  }
}
