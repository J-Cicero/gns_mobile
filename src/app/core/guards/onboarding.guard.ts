import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Vérifier la présence du token JWT (authentification)
    const token = localStorage.getItem('access_token');
    const profileStr = localStorage.getItem('student_profile');
    
    if (!token && !profileStr) {
      // Aucune session → redirection vers login
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Si l'une des deux clés est présente, on laisse passer
    // La vérification KYC détaillée se fait dans les pages individuelles
    return true;
  }
}
