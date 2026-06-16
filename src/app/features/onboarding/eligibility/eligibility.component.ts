import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { StudentProfile } from '../../../core/models/student.model';

@Component({
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styleUrls: ['./eligibility.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class EligibilityComponent implements OnInit {

  status: 'CHECKING' | 'ELIGIBLE' | 'NOT_ELIGIBLE' = 'CHECKING';
  errorMessage = '';

  constructor(
    private router: Router,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {
    this.checkEligibility();
  }

  checkEligibility() {
    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const profile: StudentProfile = JSON.parse(profileStr);

    const inscriptionId = localStorage.getItem('inscription_tracking_id');
    if (!inscriptionId) {
      this.status = 'NOT_ELIGIBLE';
      this.errorMessage = "ID d'inscription introuvable. Veuillez reprendre l'inscription académique.";
      return;
    }

    this.onboardingService.checkEligibility(inscriptionId).subscribe({
      next: (res) => {
        // Supposons que le backend renvoie l'inscription mise à jour avec isEligible (ou estInscritDefinitif)
        if (res && res.estInscritDefinitif) {
          this.status = 'ELIGIBLE';
          // Mettre à jour le profil local
          const updatedProfile = { ...profile, isEligible: true, isOnboardingComplete: true };
          localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
          
          // Après 2 secondes, rediriger vers le dashboard
          setTimeout(() => {
            this.router.navigate(['/main/dashboard']);
          }, 2000);
        } else {
          this.status = 'NOT_ELIGIBLE';
          const updatedProfile = { ...profile, isEligible: false };
          localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
        }
      },
      error: (err) => {
        this.status = 'NOT_ELIGIBLE';
        this.errorMessage = err.error?.message || "Erreur de connexion lors de la vérification.";
      }
    });
  }

  retry() {
    this.status = 'CHECKING';
    this.errorMessage = '';
    this.checkEligibility();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('student_profile');
    this.router.navigate(['/auth/login']);
  }
}
