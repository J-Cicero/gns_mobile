import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { StudentProfile } from '../../../core/models/student.model';

@Component({
  selector: 'app-academic-enrollment',
  templateUrl: './academic-enrollment.component.html',
  styleUrls: ['./academic-enrollment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AcademicEnrollmentComponent implements OnInit {

  enrollmentData = {
    matricule: '',
    faculte: '', // L'utilisateur saisit la faculté
    universiteTrackingId: '', // Sélectionné via une liste déroulante
    scolariteYearTrackingId: '' // Rempli automatiquement
  };

  universites: any[] = [];
  activeYear: any = null;

  isSubmitting = false;
  isLoadingData = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {
    // Si pas de profil en local, on renvoie à la registration
    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      this.router.navigate(['/onboarding/registration']);
      return;
    }

    this.loadUniversitesAndYear();
  }

  loadUniversitesAndYear() {
    this.isLoadingData = true;
    
    // Charger l'année active
    this.onboardingService.getActiveScolariteYear().subscribe({
      next: (year) => {
        this.activeYear = year;
        this.enrollmentData.scolariteYearTrackingId = year.trackingId;
      },
      error: () => {
        this.errorMessage = "Impossible de récupérer l'année académique active.";
      }
    });

    // Charger les universités
    this.onboardingService.getUniversites().subscribe({
      next: (res) => {
        this.universites = res.content || [];
        this.isLoadingData = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger la liste des universités.";
        this.isLoadingData = false;
      }
    });
  }

  onSubmit() {
    if (!this.enrollmentData.matricule || !this.enrollmentData.faculte || !this.enrollmentData.universiteTrackingId) {
      this.errorMessage = 'Veuillez renseigner votre matricule, votre faculté et choisir une université.';
      return;
    }
    if (!this.enrollmentData.scolariteYearTrackingId) {
      this.errorMessage = "L'année académique active est introuvable. Veuillez réessayer plus tard.";
      return;
    }

    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) return;
    const profile: StudentProfile = JSON.parse(profileStr);

    this.isSubmitting = true;
    this.errorMessage = '';

    this.onboardingService.submitAcademicInfo(profile.trackingId, this.enrollmentData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        
        // Stocker l'ID de l'inscription pour l'étape d'éligibilité
        if (res && res.trackingId) {
          localStorage.setItem('inscription_tracking_id', res.trackingId);
        }

        // Mettre à jour le profil local
        const updatedProfile = {
          ...profile,
          isOnboardingComplete: true // L'inscription académique est terminée
        };
        localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
        
        // Redirection vers l'étape de vérification d'éligibilité
        this.router.navigate(['/onboarding/eligibility']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement académique.";
      }
    });
  }

}
