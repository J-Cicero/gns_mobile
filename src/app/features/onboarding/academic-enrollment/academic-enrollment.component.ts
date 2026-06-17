import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular'; // Import NavController
import { Router } from '@angular/router'; // Keep Router for now if still needed elsewhere
import { OnboardingService } from '../../../core/services/onboarding.service';
import { StudentProfile } from '../../../core/models/student.model';

@Component({
  selector: 'app-academic-enrollment',
  templateUrl: './academic-enrollment.component.html',
  styleUrls: ['./academic-enrollment.component.scss'], // Corrected file name
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule] // Removed RouterLink from here
})
export class AcademicEnrollmentComponent implements OnInit {

  enrollmentData = {
    niveauEtude: '', // Renommé de faculte
    scolariteYearTrackingId: '' // Rempli automatiquement
  };

  activeYear: any = null;
  studentProfile: StudentProfile | null = null; // Pour stocker les infos de l'étudiant

  isSubmitting = false;
  isLoadingData = true;
  errorMessage = '';

  constructor(
    private router: Router, // Keep Router if still used for other navigation types (e.g. within tabs)
    private navCtrl: NavController, // Inject NavController
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {
    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      this.navCtrl.navigateRoot('/onboarding/registration'); // Use navCtrl
      return;
    }
    this.studentProfile = JSON.parse(profileStr);

    // Vérifier si l'étudiant a déjà une université et un matricule dans son profil
    if (!this.studentProfile?.universiteTrackingId || !this.studentProfile?.matricule) {
      this.errorMessage = "Votre profil est incomplet. Veuillez contacter l'administration.";
      this.isLoadingData = false;
      return;
    }

    this.loadActiveYear();
  }

  loadActiveYear() {
    this.isLoadingData = true;
    this.onboardingService.getActiveScolariteYear().subscribe({
      next: (year) => {
        console.log('Année académique active reçue:', year);
        this.activeYear = year;
        this.enrollmentData.scolariteYearTrackingId = year.trackingId;
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'année académique active:', err);
        this.errorMessage = "Impossible de récupérer l'année académique active. " + (err.error?.message || "Veuillez réessayer plus tard.");
        this.isLoadingData = false;
      }
    });
  }

  onSubmit() {
    if (!this.studentProfile || !this.studentProfile.trackingId) {
      this.errorMessage = "Informations étudiant manquantes.";
      return;
    }

    if (!this.enrollmentData.niveauEtude) {
      this.errorMessage = 'Veuillez renseigner votre niveau d\'étude.';
      return;
    }
    if (!this.enrollmentData.scolariteYearTrackingId) {
      this.errorMessage = "L'année académique active est introuvable. Veuillez réessayer plus tard.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      studentTrackingId: this.studentProfile.trackingId,
      universiteTrackingId: this.studentProfile.universiteTrackingId, // Vient du profil
      scolariteYearTrackingId: this.enrollmentData.scolariteYearTrackingId,
      matricule: this.studentProfile.matricule, // Vient du profil
      studyLevel: this.enrollmentData.niveauEtude, // Nouveau nom
    };

    this.onboardingService.submitAcademicInfo(this.studentProfile.trackingId, payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        
        if (res && res.trackingId) {
          localStorage.setItem('inscription_tracking_id', res.trackingId);
        }

        const updatedProfile = {
          ...this.studentProfile,
          isOnboardingComplete: true
        };
        localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
        
        this.navCtrl.navigateRoot('/onboarding/eligibility'); // Use navCtrl
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement académique.";
      }
    });
  }

}
