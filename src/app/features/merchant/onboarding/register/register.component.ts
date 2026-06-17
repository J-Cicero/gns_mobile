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
    registrationNumber: '',
    description: '',
    accountNumber: '',
    bankTrackingId: ''
  };

  banks: any[] = [];
  selectedRib: File | null = null;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private merchantService: MerchantService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBanks();
  }

  loadBanks() {
    this.merchantService.getBanks().subscribe({
      next: (banks) => this.banks = banks,
      error: () => console.error('Erreur lors du chargement des banques')
    });
  }

  onFileSelected(event: any) {
    this.selectedRib = event.target.files[0];
  }

  onSubmit() {
    if (!this.merchantData.email || !this.merchantData.password || !this.merchantData.businessName || !this.selectedRib) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires et uploader votre RIB.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    // Création d'un blob JSON pour le payload MerchantRequest
    const merchantBlob = new Blob([JSON.stringify(this.merchantData)], { type: 'application/json' });
    formData.append('merchant', merchantBlob);
    formData.append('rib', this.selectedRib);

    // Envoi de la demande de création de marchand
    this.merchantService.registerMerchant(formData).subscribe({
      next: (res) => {
        // Connexion automatique après inscription
        this.authService.login({
          email: this.merchantData.email,
          password: this.merchantData.password
        }).subscribe({
          next: (loginRes) => {
            // Le Auth service stocke un token.
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
