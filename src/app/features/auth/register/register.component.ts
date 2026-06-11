import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
// Ajout de l'icône arrowBackOutline pour le bouton retour
import { personOutline, storefrontOutline, mailOutline, lockClosedOutline, flash, arrowForward, alertCircle, cardOutline, arrowBackOutline, chevronForwardOutline } from 'ionicons/icons';

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
    matricule: '',
    nomBoutique: '',
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(private router: Router) {
    addIcons({ personOutline, storefrontOutline, mailOutline, lockClosedOutline, flash, arrowForward, alertCircle, cardOutline, arrowBackOutline, chevronForwardOutline });
  }

  // Fonction pour l'étape 1 : Choisir le rôle et passer à l'étape 2
  selectRole(role: 'ETUDIANT' | 'COMMERCANT') {
    this.selectedRole = role;
    this.errorMessage = '';
    this.step = 2; // On passe au formulaire
  }

  // Fonction pour revenir à l'étape 1
  goBackToStep1() {
    this.step = 1;
    this.errorMessage = '';
  }

  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';
    
    setTimeout(() => {
      this.isLoading = false;
      console.log('Inscription :', this.selectedRole, this.registerData);
      this.router.navigate(['/login']);
    }, 1500);
  }
}