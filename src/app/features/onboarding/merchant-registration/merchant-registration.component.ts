import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-merchant-registration',
  templateUrl: './merchant-registration.component.html',
  styleUrls: ['./merchant-registration.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MerchantRegistrationComponent implements OnInit {

  registrationData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    businessName: '',
    bankTrackingId: '',
    accountNumber: ''
  };

  banques: any[] = [];
  ribFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private onboardingService: OnboardingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadBanques();
  }

  loadBanques() {
    this.onboardingService.getBanques().subscribe({
      next: (res: any) => {
        this.banques = Array.isArray(res) ? res : (res.content || []);
      },
      error: (err: any) => {
        console.error('Erreur chargement banques', err);
        this.errorMessage = 'Impossible de charger la liste des banques.';
      }
    });
  }

  onRibSelected(event: any) {
    if (event.target.files.length > 0) {
      this.ribFile = event.target.files[0];
    }
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/auth/login');
  }

  onSubmit() {
    if (!this.registrationData.nom || !this.registrationData.prenom || !this.registrationData.email || !this.registrationData.motDePasse || !this.registrationData.businessName || !this.registrationData.bankTrackingId || !this.registrationData.accountNumber || !this.ribFile) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires et uploader votre RIB.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      lastName: this.registrationData.nom,
      firstName: this.registrationData.prenom,
      email: this.registrationData.email,
      phoneNumber: this.registrationData.telephone,
      password: this.registrationData.motDePasse,
      businessName: this.registrationData.businessName,
      bankTrackingId: this.registrationData.bankTrackingId,
      accountNumber: this.registrationData.accountNumber
    };

    this.onboardingService.registerMerchant(payload, this.ribFile).subscribe({
      next: (res: any) => {
        this.authService.login({
          email: this.registrationData.email,
          password: this.registrationData.motDePasse
        }).subscribe({
          next: (loginRes: any) => {
            this.isSubmitting = false;
            // Rediriger le marchand vers son dashboard ou la page KYC (à définir)
            this.navCtrl.navigateRoot('/merchant'); // Ou une autre route spécifique
          },
          error: (err: any) => {
            this.isSubmitting = false;
            this.errorMessage = "Compte créé mais connexion automatique échouée. Veuillez vous connecter.";
            setTimeout(() => this.navCtrl.navigateRoot('/auth/login'), 2000);
          }
        });
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création du compte commerçant. Veuillez réessayer.';
      }
    });
  }

}
