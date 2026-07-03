import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { forkJoin } from 'rxjs';
import { StudentProfile } from '../../../core/models/student.model';
import {
  InscriptionAnnuelleRequest,
  StatutInscription,
  StudentNiveau,
  SourceVerification
} from '../../../core/models/inscription-annuelle.model'; // Import models and enums

@Component({
  selector: 'app-academic-enrollment',
  templateUrl: './academic-enrollment.component.html',
  styleUrls: ['./academic-enrollment.component.scss'], // Corrected file name
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule] // Removed RouterLink from here
})
export class AcademicEnrollmentComponent implements OnInit {

  enrollmentData = {
    niveauEtude: '',
    scolariteYearTrackingId: ''
  };

  activeYear: any = null;
  studentProfile: StudentProfile | null = null;

  allDocumentsRequis: any[] = [];
  filteredDocumentsRequis: any[] = [];
  selectedFiles: { [key: string]: File } = {};

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

    this.loadActiveYear();

    // Vérifier si l'étudiant a déjà une université et un matricule dans son profil
    if (!this.studentProfile?.universiteTrackingId || !this.studentProfile?.studentIdNumber) {
      this.errorMessage = "Votre profil est incomplet (Université ou Matricule manquant). Veuillez recréer un compte pour tester correctement.";
      this.isLoadingData = false;
      return;
    }

    this.loadDocumentsRequis();
  }

  loadDocumentsRequis() {
    this.onboardingService.getDocumentRequis().subscribe({
      next: (docs) => {
        this.allDocumentsRequis = docs;
      },
      error: (err) => console.error('Erreur chargement documents requis', err)
    });
  }

  onNiveauChange() {
    this.filteredDocumentsRequis = this.allDocumentsRequis.filter(doc =>
      doc.studentNiveau === null || doc.studentNiveau === undefined || doc.studentNiveau === this.enrollmentData.niveauEtude
    );
    this.selectedFiles = {};
  }

  onFileSelected(event: any, typeDocument: string) {
    if (event.target.files.length > 0) {
      this.selectedFiles[typeDocument] = event.target.files[0];
    }
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

    if (this.filteredDocumentsRequis.length > 0) {
      const missingDocs = this.filteredDocumentsRequis.filter(doc => !this.selectedFiles[doc.typeDocument]);
      if (missingDocs.length > 0) {
        this.errorMessage = "Veuillez uploader tous les documents requis.";
        return;
      }
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: InscriptionAnnuelleRequest = {
      studentTrackingId: this.studentProfile.trackingId,
      academicYearLabel: this.activeYear.label,
      studyLevel: this.enrollmentData.niveauEtude as StudentNiveau,
      totalValidatedCredits: 0,
      highSchoolGrade: 0,
      isScholarshipHolder: this.studentProfile.isEligible,
      scholarshipType: undefined,
      status: StatutInscription.EN_ATTENTE,
      source: SourceVerification.MANUELLE,
    };

    this.onboardingService.submitAcademicInfo(payload).subscribe({
      next: (res: any) => {
        const trackingId = res.trackingId;
        localStorage.setItem('inscription_tracking_id', trackingId);

        if (this.filteredDocumentsRequis.length > 0) {
          const uploadRequests = this.filteredDocumentsRequis.map(doc =>
            this.onboardingService.uploadDocument(this.selectedFiles[doc.typeDocument], this.studentProfile!.trackingId, trackingId, doc.typeDocument)
          );

          forkJoin(uploadRequests).subscribe({
            next: () => {
              this.validerInscription(trackingId);
            },
            error: (err: any) => {
              this.isSubmitting = false;
              this.errorMessage = "Erreur lors de l'upload des documents.";
            }
          });
        } else {
          this.validerInscription(trackingId);
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement académique.";
      }
    });
  }

  validerInscription(trackingId: string) {
    this.onboardingService.validerInscription(trackingId).subscribe({
      next: () => {
        this.isSubmitting = false;
        const updatedProfile = { ...this.studentProfile, isOnboardingComplete: true };
        localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
        this.navCtrl.navigateRoot('/onboarding/eligibility');
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || "Erreur lors de la validation de l'inscription.";
      }
    });
  }

}
