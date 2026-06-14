import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { personOutline, storefrontOutline, mailOutline, lockClosedOutline, flash, arrowForward, alertCircle, cardOutline, arrowBackOutline, chevronForwardOutline, callOutline, documentOutline, cloudUploadOutline, businessOutline, checkmarkOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { BanqueService } from '../../../core/services/banque.service';
import { UniversiteService } from '../../../core/services/universite.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // 1 = Choix profil, 2 = Identité, 3 = Banque/Université, 4 = Justificatifs
  step: 1 | 2 | 3 | 4 = 1;
  selectedRole: 'ETUDIANT' | 'COMMERCANT' = 'ETUDIANT';
  
  registerData = {
    nom: '',
    prenom: '',
    telephone: '',
    matricule: '',
    universiteTrackingId: '',
    banqueTrackingId: '',
    numeroCompte: '',
    nomBoutique: '',
    email: '',
    password: ''
  };

  ribFile: File | null = null;
  mandatFile: File | null = null;

  banques: any[] = [];
  universites: any[] = [];

  isLoading = false;
  errorMessage = '';
  activeYear: any = null;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private studentService: StudentService,
    private banqueService: BanqueService,
    private universiteService: UniversiteService
  ) {
    addIcons({ personOutline, storefrontOutline, mailOutline, lockClosedOutline, flash, arrowForward, alertCircle, cardOutline, arrowBackOutline, chevronForwardOutline, callOutline, documentOutline, cloudUploadOutline, businessOutline, checkmarkOutline });
  }

  ngOnInit() {
    this.checkActiveYear();
    this.loadBanques();
    this.loadUniversites();
  }

  checkActiveYear() {
    this.studentService.getActiveYear().subscribe({
      next: (year) => {
        this.activeYear = year;
      },
      error: () => {
        this.activeYear = null;
      }
    });
  }

  loadBanques() {
    this.banqueService.getAllBanques().subscribe({
      next: (data) => this.banques = data,
      error: (err) => console.error("Erreur chargement banques", err)
    });
  }

  loadUniversites() {
    this.universiteService.getUniversites().subscribe({
      next: (data) => this.universites = data.content || data,
      error: (err) => console.error("Erreur chargement universités", err)
    });
  }

  selectRole(role: 'ETUDIANT' | 'COMMERCANT') {
    this.selectedRole = role;
    this.step = 2;
  }

  goBack() {
    if (this.step > 1) {
      this.step--;
    }
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  nextStep() {
    this.errorMessage = '';
    // Validation Etape 2 (Identité)
    if (this.step === 2) {
      if (this.selectedRole === 'ETUDIANT') {
        if (!this.registerData.nom || !this.registerData.prenom || !this.registerData.email || !this.registerData.password || !this.registerData.matricule || !this.registerData.telephone) {
          this.errorMessage = "Veuillez remplir tous les champs.";
          return;
        }
        this.step = 3;
      } else {
        if (!this.registerData.nomBoutique || !this.registerData.nom || !this.registerData.email || !this.registerData.password || !this.registerData.telephone) {
          this.errorMessage = "Veuillez remplir tous les champs.";
          return;
        }
        this.step = 3;
      }
    } 
    else if (this.step === 3) {
      if (this.selectedRole === 'ETUDIANT') {
        if (!this.registerData.universiteTrackingId || !this.registerData.banqueTrackingId || !this.registerData.numeroCompte) {
          this.errorMessage = "Veuillez remplir tous les champs de liaison.";
          return;
        }
      } else {
        if (!this.registerData.banqueTrackingId || !this.registerData.numeroCompte) {
          this.errorMessage = "Veuillez remplir les informations bancaires.";
          return;
        }
      }
      this.step = 4;
    }
  }

  onFileSelected(event: any, type: 'rib' | 'mandat') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'rib') this.ribFile = file;
      else if (type === 'mandat') this.mandatFile = file;
    }
  }

  submitRegistration() {
    if (this.selectedRole === 'ETUDIANT' && !this.activeYear) {
      this.errorMessage = "Aucune année scolaire active. L'inscription est temporairement suspendue.";
      return;
    }

    if (this.selectedRole === 'ETUDIANT' && (!this.ribFile || !this.mandatFile)) {
      this.errorMessage = "Veuillez uploader le RIB et le Mandat.";
      return;
    }

    if (this.selectedRole === 'COMMERCANT' && !this.ribFile) {
      this.errorMessage = "Veuillez uploader le RIB.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    
    if (this.selectedRole === 'ETUDIANT') {
      const studentRequest = {
        nom: this.registerData.nom,
        prenom: this.registerData.prenom,
        telephone: this.registerData.telephone,
        email: this.registerData.email,
        password: this.registerData.password,
        matricule: this.registerData.matricule,
        universiteTrackingId: this.registerData.universiteTrackingId,
        banqueTrackingId: this.registerData.banqueTrackingId,
        numeroCompte: this.registerData.numeroCompte,
        estActif: true
      };
      formData.append('request', JSON.stringify(studentRequest));
      formData.append('rib', this.ribFile as File);
      formData.append('mandat', this.mandatFile as File);

      this.studentService.registerStudentUnified(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.navCtrl.navigateRoot('/login');
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
        }
      });
    } else {
      const merchantRequest = {
        nom: this.registerData.nom,
        prenom: this.registerData.prenom || 'Boutique',
        telephone: this.registerData.telephone,
        email: this.registerData.email,
        password: this.registerData.password,
        nomBoutique: this.registerData.nomBoutique,
        banqueTrackingId: this.registerData.banqueTrackingId,
        numeroCompte: this.registerData.numeroCompte,
        estActif: true
      };
      formData.append('request', JSON.stringify(merchantRequest));
      formData.append('rib', this.ribFile as File);

      this.authService.registerMerchantUnified(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.navCtrl.navigateRoot('/login');
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
        }
      });
    }
  }
}