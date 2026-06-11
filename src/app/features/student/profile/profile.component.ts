import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  personOutline, 
  cardOutline, 
  shieldCheckmarkOutline, 
  logOutOutline, 
  alertCircleOutline, 
  idCardOutline,
  ellipse
} from 'ionicons/icons';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading = false;

  // Données mockées de l'étudiant et de sa carte physique PVC
  studentProfile = {
    nom: 'Koffi AMEGAVIE',
    matricule: '245-UL-2025',
    niveau: 'Licence 2 (L2)',
    email: 'koffi.amegavie@faseg.ul.tg',
    statutInscription: 'ACTIVE', // EN_ATTENTE, VERIFIE_UL, ACTIVE, REJETEE
    cartePvc: {
      numeroUnique: '4022 •••• •••• 8812',
      statut: 'ACTIVE' // ACTIVE ou INACTIVE (Perdue/Volée)
    }
  };

  constructor(private router: Router) {
    addIcons({ arrowBackOutline, personOutline, cardOutline, shieldCheckmarkOutline, logOutOutline, alertCircleOutline, idCardOutline, ellipse });
  }

  ngOnInit(): void {}

  // Fonction d'urgence pour déclarer la carte perdue/volée
  declarerCartePerdue() {
    this.isLoading = true;
    
    // Simulation du blocage instantané
    setTimeout(() => {
      this.isLoading = false;
      this.studentProfile.cartePvc.statut = 'INACTIVE';
      alert('Votre carte physique PVC a été suspendue avec succès. Rapprochez-vous du guichet GNS pour un renouvellement.');
    }, 1200);
  }

  deconnexion() {
    // Redirection vers le login
    this.router.navigate(['/login']);
  }
}