import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
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

  currentStep = 1;
  registrationData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    birthDate: '',
    birthPlace: '',
    studentIdNumber: '',
    universiteTrackingId: '',
    bankTrackingId: '',
    accountNumber: '',
    transactionPin: '',
    confirmTransactionPin: ''
  };

  universites: any[] = [];
  banques: any[] = [];
  ribFile: File | null = null;
  mandatFile: File | null = null;

  isSubmitting = false;
  errorMessage = '';
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private navCtrl: NavController,
    private onboardingService: OnboardingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUniversites();
    this.loadBanques();

    // Restauration de l'état en cas de rafraîchissement (ex: lors du choix de fichier sur mobile)
    const savedState = sessionStorage.getItem('studentRegistrationState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.currentStep = state.currentStep || 1;
        this.registrationData = state.registrationData || this.registrationData;
      } catch (e) {
        console.error('Erreur lecture state', e);
      }
    }
  }

  saveState() {
    sessionStorage.setItem('studentRegistrationState', JSON.stringify({
      currentStep: this.currentStep,
      registrationData: this.registrationData
    }));
  }

  loadUniversites() {
    this.onboardingService.getUniversites().subscribe({
      next: (res: any) => {
        this.universites = res.content || [];
      },
      error: (err: any) => {
        console.error('Erreur chargement universités', err);
      }
    });
  }

  loadBanques() {
    this.onboardingService.getBanques().subscribe({
      next: (res: any) => {
        this.banques = Array.isArray(res) ? res : (res.content || []);
      },
      error: (err: any) => {
        console.error('Erreur chargement banques', err);
      }
    });
  }

  onRibSelected(event: any) {
    if (event.target.files.length > 0) {
      this.ribFile = event.target.files[0];
    }
  }

  onMandatSelected(event: any) {
    if (event.target.files.length > 0) {
      this.mandatFile = event.target.files[0];
    }
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/auth/login');
  }

  nextStep() {
    this.errorMessage = '';
    if (this.currentStep === 1) {
      if (!this.registrationData.nom || !this.registrationData.prenom || !this.registrationData.email || !this.registrationData.motDePasse || !this.registrationData.transactionPin) {
        this.errorMessage = 'Veuillez remplir vos informations personnelles et votre PIN de paiement.';
        return;
      }
      if (this.registrationData.transactionPin !== this.registrationData.confirmTransactionPin || !/^\d{4,6}$/.test(this.registrationData.transactionPin)) {
        this.errorMessage = 'Le code PIN doit comporter 4 à 6 chiffres et correspondre à sa confirmation.';
        return;
      }
      this.currentStep = 2;
      this.saveState();
    } else if (this.currentStep === 2) {
      // Bank is optional, but if selected, account number is required
      if (this.registrationData.bankTrackingId && !this.registrationData.accountNumber) {
        this.errorMessage = 'Veuillez fournir un numéro de compte pour la banque sélectionnée.';
        return;
      }
      if (this.registrationData.bankTrackingId && (!this.ribFile || !this.mandatFile)) {
        this.errorMessage = 'Veuillez fournir le RIB et le Mandat Signé.';
        return;
      }
      this.currentStep = 3;
      this.saveState();
    }
  }

  prevStep() {
    this.errorMessage = '';
    if (this.currentStep > 1) {
      this.currentStep--;
      this.saveState();
    }
  }

  onSubmit() {
    if (this.currentStep === 3) {
      if (!this.registrationData.studentIdNumber || !this.registrationData.universiteTrackingId) {
        this.errorMessage = 'Veuillez remplir vos informations académiques.';
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
        studentNumber: this.registrationData.studentIdNumber,
        universiteTrackingId: this.registrationData.universiteTrackingId,
        bankTrackingId: this.registrationData.bankTrackingId,
        accountNumber: this.registrationData.accountNumber,
        transactionPin: this.registrationData.transactionPin,
        birthDate: this.registrationData.birthDate ? `${this.registrationData.birthDate}T00:00:00` : undefined,
        birthPlace: this.registrationData.birthPlace
      };

      this.onboardingService.registerStudent(payload, this.ribFile || undefined, this.mandatFile || undefined).subscribe({
        next: (res: any) => {
          sessionStorage.removeItem('studentRegistrationState'); // Nettoyage
          this.authService.login({
            email: this.registrationData.email,
            password: this.registrationData.motDePasse
          }).subscribe({
            next: (loginRes: any) => {
              this.isSubmitting = false;
              const profile = JSON.parse(localStorage.getItem('student_profile') || '{}');
              profile.isOnboardingComplete = false;
              profile.isEligible = false;
              localStorage.setItem('student_profile', JSON.stringify(profile));
              
              this.navCtrl.navigateRoot('/onboarding/academic-enrollment');
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
          this.errorMessage = err.error?.message || 'Erreur lors de la création du compte. Veuillez réessayer.';
        }
      });
    }
  }

}
