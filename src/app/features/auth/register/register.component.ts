import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
// Ajout de l'icône arrowBackOutline pour le bouton retour
import { personOutline, storefrontOutline, mailOutline, lockClosedOutline, flash, arrowForward, alertCircle, cardOutline, arrowBackOutline, chevronForwardOutline, callOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Gestion de l'étape actuelle (1 = Choix du profil, 2 = Formulaire)
  step: 1 | 2 = 1;
  selectedRole: 'ETUDIANT' | 'COMMERCANT' = 'ETUDIANT';
  
  registerData = {
    nom: '',
    prenom: '',
    telephone: '',
    matricule: '',
    nomBoutique: '',
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  activeYear: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService
  ) {
    addIcons({ personOutline, storefrontOutline, mailOutline, lockClosedOutline, flash, arrowForward, alertCircle, cardOutline, arrowBackOutline, chevronForwardOutline, callOutline });
  }

  ngOnInit() {
    this.checkActiveYear();
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

  selectRole(role: 'ETUDIANT' | 'COMMERCANT') {
    this.selectedRole = role;
    this.step = 2;
  }

  goBackToStep1() {
    this.step = 1;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    if (this.selectedRole === 'ETUDIANT' && !this.activeYear) {
      this.errorMessage = "Aucune année scolaire active. L'inscription est temporairement suspendue.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.selectedRole === 'ETUDIANT') {
      const studentPayload = {
        nom: this.registerData.nom,
        prenom: this.registerData.prenom,
        telephone: this.registerData.telephone,
        email: this.registerData.email,
        password: this.registerData.password,
        matricule: this.registerData.matricule,
        role: 'ETUDIANT',
        estActif: true
      };

      this.studentService.registerStudent(studentPayload).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
        }
      });
    } else {
      // Pour COMMERCANT, utiliser l'API auth/users par défaut pour le moment
      const payload = {
        nom: this.registerData.nomBoutique,
        prenom: 'Boutique', // Fallback
        telephone: this.registerData.telephone,
        email: this.registerData.email,
        motDePasse: this.registerData.password,
        role: 'COMMERCANT',
        pays: 'Togo'
      };

      this.authService.register(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
        }
      });
    }
  }
}