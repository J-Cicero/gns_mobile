import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  personOutline, 
  cardOutline, 
  shieldCheckmarkOutline, 
  logOutOutline, 
  alertCircleOutline, 
  idCardOutline,
  ellipse,
  moonOutline,
  sunnyOutline
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
  isDarkMode = false;

  studentProfile: any = {
    nom: 'Chargement...',
    niveau: '...',
    anneeScolaire: '...'
  };

  constructor(
    private router: Router, 
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private studentService: StudentService
  ) {
    addIcons({ arrowBackOutline, personOutline, cardOutline, shieldCheckmarkOutline, logOutOutline, alertCircleOutline, idCardOutline, ellipse, moonOutline, sunnyOutline });
  }

  ngOnInit(): void {
    this.isDarkMode = document.body.classList.contains('dark') || document.documentElement.classList.contains('dark');
    this.loadProfile();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  loadProfile() {
    const studentId = this.authService.getCurrentUserId();
    if (!studentId) return;

    this.isLoading = true;
    forkJoin([
      this.studentService.getStudentByTrackingId(studentId),
      this.studentService.getStudentInscriptions(studentId)
    ]).subscribe({
      next: ([studentRes, inscriptionsRes]) => {
        let derniereInscription = null;
        let anneeScolaire = 'Non définie';

        if (inscriptionsRes && inscriptionsRes.content && inscriptionsRes.content.length > 0) {
          derniereInscription = inscriptionsRes.content[0];
          // Try to extract the academic year label if it's populated
          anneeScolaire = derniereInscription?.scolariteYear?.libelle || 
                          derniereInscription?.scolariteYearId || 
                          'Année académique en cours';
        }

        this.studentProfile = {
          nom: (studentRes.nom + ' ' + studentRes.prenom) || 'Étudiant',
          niveau: derniereInscription?.niveau || 'N/A',
          anneeScolaire: anneeScolaire
        };
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // Supprimé : gestion de la carte PVC

  deconnexion() {
    // Nettoyer les données d'authentification
    this.authService.logout();
    
    // Redirection propre à la racine avec NavController (évite les bugs d'animation/outlet)
    this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'back' });
  }
}