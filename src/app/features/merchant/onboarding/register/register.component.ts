import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MerchantService } from '../../../../core/services/merchant.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-merchant-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterComponent implements OnInit {

  merchantData = {
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    phoneNumber: '',
    businessName: '',
    registrationNumber: ''
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private merchantService: MerchantService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (!this.merchantData.email || !this.merchantData.password || !this.merchantData.businessName) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Envoi de la demande de création de marchand
    this.merchantService.registerMerchant(this.merchantData).subscribe({
      next: (res) => {
        // Connexion automatique après inscription
        this.authService.login({
          email: this.merchantData.email,
          password: this.merchantData.password
        }).subscribe({
          next: (loginRes) => {
            // Le Auth service stocke un token.
            // Il faudrait récupérer le profil marchand ici.
            this.merchantService.getMerchantProfile(loginRes.trackingId).subscribe({
              next: (profile) => {
                localStorage.setItem('merchant_profile', JSON.stringify(profile));
                this.isSubmitting = false;
                this.router.navigate(['/merchant/onboarding/kyc-upload']);
              },
              error: () => {
                this.isSubmitting = false;
                this.errorMessage = "Compte créé mais échec de récupération du profil.";
              }
            });
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = "Compte créé mais échec de la connexion automatique.";
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || "Erreur lors de la création du compte marchand.";
      }
    });
  }
}
