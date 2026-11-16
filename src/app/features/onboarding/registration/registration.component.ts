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
  ribPreviewUrl: string | null = null;
  mandatPreviewUrl: string | null = null;

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

    // Restauration de l'état en cas de rafraîchissement (ex: ouverture caméra sur mobile)
    const savedState = sessionStorage.getItem('studentRegistrationState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.currentStep = state.currentStep || 1;
        this.registrationData = { ...this.registrationData, ...(state.registrationData || {}) };
        if (state.ribDataUrl && state.ribFileName) {
          this.ribFile = this.dataUrlToFile(state.ribDataUrl, state.ribFileName, state.ribMimeType || 'image/jpeg');
          if ((state.ribMimeType || '').startsWith('image/')) {
            this.ribPreviewUrl = state.ribDataUrl;
          }
        }
        if (state.mandatDataUrl && state.mandatFileName) {
          this.mandatFile = this.dataUrlToFile(state.mandatDataUrl, state.mandatFileName, state.mandatMimeType || 'image/jpeg');
          if ((state.mandatMimeType || '').startsWith('image/')) {
            this.mandatPreviewUrl = state.mandatDataUrl;
          }
        }
      } catch (e) {
        console.error('Erreur lecture state', e);
      }
    }
  }

  saveState() {
    try {
      const existingRaw = sessionStorage.getItem('studentRegistrationState');
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      sessionStorage.setItem('studentRegistrationState', JSON.stringify({
        ...existing,
        currentStep: this.currentStep,
        registrationData: this.registrationData
      }));
    } catch (e) {
      console.warn('Impossible de sauvegarder studentRegistrationState', e);
    }
  }

  private saveFileToState(prefix: 'rib' | 'mandat', dataUrl: string | null, fileName: string | null, mimeType: string | null) {
    try {
      const existingRaw = sessionStorage.getItem('studentRegistrationState');
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      existing.currentStep = this.currentStep;
      existing.registrationData = this.registrationData;
      existing[`${prefix}DataUrl`] = dataUrl;
      existing[`${prefix}FileName`] = fileName;
      existing[`${prefix}MimeType`] = mimeType;
      sessionStorage.setItem('studentRegistrationState', JSON.stringify(existing));
    } catch (e) {
      console.warn('Stockage session limité pour le fichier', prefix, e);
    }
  }

  private dataUrlToFile(dataUrl: string, filename: string, mimeType: string): File {
    const arr = dataUrl.split(',');
    const bstr = atob(arr[1] || '');
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mimeType });
  }

  private processSelectedFile(rawFile: File, prefix: 'rib' | 'mandat'): Promise<{ file: File; dataUrl: string | null }> {
    return new Promise((resolve) => {
      if (!rawFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = typeof reader.result === 'string' && rawFile.size <= 2 * 1024 * 1024 ? reader.result : null;
          resolve({ file: rawFile, dataUrl });
        };
        reader.onerror = () => resolve({ file: rawFile, dataUrl: null });
        reader.readAsDataURL(rawFile);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ file: rawFile, dataUrl: e.target.result });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const cleanName = `${prefix}_${Date.now()}.jpg`;
          const compressedFile = this.dataUrlToFile(compressedDataUrl, cleanName, 'image/jpeg');
          resolve({ file: compressedFile, dataUrl: compressedDataUrl });
        };
        img.onerror = () => resolve({ file: rawFile, dataUrl: null });
        img.src = e.target.result;
      };
      reader.onerror = () => resolve({ file: rawFile, dataUrl: null });
      reader.readAsDataURL(rawFile);
    });
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

  async onRibSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const rawFile = input.files[0];
      this.saveState();
      const { file, dataUrl } = await this.processSelectedFile(rawFile, 'rib');
      this.ribFile = file;
      this.ribPreviewUrl = file.type.startsWith('image/') ? dataUrl : null;
      this.saveFileToState('rib', dataUrl, file.name, file.type);
    }
  }

  async onMandatSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const rawFile = input.files[0];
      this.saveState();
      const { file, dataUrl } = await this.processSelectedFile(rawFile, 'mandat');
      this.mandatFile = file;
      this.mandatPreviewUrl = file.type.startsWith('image/') ? dataUrl : null;
      this.saveFileToState('mandat', dataUrl, file.name, file.type);
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

      const payload: any = {
        lastName: this.registrationData.nom,
        firstName: this.registrationData.prenom,
        email: this.registrationData.email,
        phoneNumber: this.registrationData.telephone,
        password: this.registrationData.motDePasse,
        studentNumber: this.registrationData.studentIdNumber,
        universiteTrackingId: this.registrationData.universiteTrackingId,
        banqueTrackingId: this.registrationData.bankTrackingId || null,
        numeroCompte: this.registrationData.accountNumber || null,
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
