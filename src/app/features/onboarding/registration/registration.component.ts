import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegistrationComponent implements OnInit {

  registrationData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: ''
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private onboardingService: OnboardingService,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  onSubmit() {
    if (!this.registrationData.nom || !this.registrationData.prenom || !this.registrationData.email || !this.registrationData.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.onboardingService.register({ ...this.registrationData, password: this.registrationData.motDePasse }).subscribe({
      next: (res) => {
        // Le profil est créé. On doit maintenant faire un login pour avoir le token
        this.authService.login({
          username: this.registrationData.email,
          password: this.registrationData.motDePasse
        }).subscribe({
          next: (loginRes) => {
            this.isSubmitting = false;
            // Le login a stocké le profil et le token.
            // On s'assure que isOnboardingComplete est false pour la suite.
            const profile = JSON.parse(localStorage.getItem('student_profile') || '{}');
            profile.isOnboardingComplete = false;
            profile.isEligible = false;
            localStorage.setItem('student_profile', JSON.stringify(profile));
            
            this.router.navigate(['/onboarding/academic-enrollment']);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = "Compte créé mais connexion automatique échouée. Veuillez vous connecter.";
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création du compte. Veuillez réessayer.';
      }
    });
  }

}
