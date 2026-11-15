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
  filePreviews: { [key: string]: string | null } = {};

  isSubmitting = false;
  isLoadingData = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {
    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      this.navCtrl.navigateRoot('/onboarding/registration');
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
        this.restoreSavedEnrollmentState();
      },
      error: (err) => console.error('Erreur chargement documents requis', err)
    });
  }

  private restoreSavedEnrollmentState() {
    try {
      const savedRaw = sessionStorage.getItem('academicEnrollmentState');
      if (!savedRaw) return;
      const saved = JSON.parse(savedRaw);
      if (saved.niveauEtude) {
        this.enrollmentData.niveauEtude = saved.niveauEtude;
        this.filteredDocumentsRequis = this.allDocumentsRequis.filter(doc =>
          doc.studentNiveau === null || doc.studentNiveau === undefined || doc.studentNiveau === this.enrollmentData.niveauEtude
        );
      }
      if (saved.files && typeof saved.files === 'object') {
        Object.keys(saved.files).forEach(typeDoc => {
          const item = saved.files[typeDoc];
          if (item && item.dataUrl && item.fileName) {
            this.selectedFiles[typeDoc] = this.dataUrlToFile(item.dataUrl, item.fileName, item.mimeType || 'image/jpeg');
            if ((item.mimeType || '').startsWith('image/')) {
              this.filePreviews[typeDoc] = item.dataUrl;
            }
          }
        });
      }
    } catch (e) {
      console.warn('Impossible de restaurer academicEnrollmentState', e);
    }
  }

  private saveEnrollmentState(typeDocument?: string, dataUrl?: string | null, fileName?: string, mimeType?: string) {
    try {
      const savedRaw = sessionStorage.getItem('academicEnrollmentState');
      const saved = savedRaw ? JSON.parse(savedRaw) : { files: {} };
      saved.niveauEtude = this.enrollmentData.niveauEtude;
      if (!saved.files) saved.files = {};
      if (typeDocument && fileName) {
        saved.files[typeDocument] = { dataUrl, fileName, mimeType };
      }
      sessionStorage.setItem('academicEnrollmentState', JSON.stringify(saved));
    } catch (e) {
      console.warn('Stockage session limité pour academicEnrollmentState', e);
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

  private processSelectedFile(rawFile: File, prefix: string): Promise<{ file: File; dataUrl: string | null }> {
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
          const cleanName = `${prefix.toLowerCase()}_${Date.now()}.jpg`;
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

  onNiveauChange() {
    this.filteredDocumentsRequis = this.allDocumentsRequis.filter(doc =>
      doc.studentNiveau === null || doc.studentNiveau === undefined || doc.studentNiveau === this.enrollmentData.niveauEtude
    );
    this.selectedFiles = {};
    this.filePreviews = {};
    sessionStorage.setItem('academicEnrollmentState', JSON.stringify({
      niveauEtude: this.enrollmentData.niveauEtude,
      files: {}
    }));
  }

  async onFileSelected(event: any, typeDocument: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const rawFile = input.files[0];
      const { file, dataUrl } = await this.processSelectedFile(rawFile, typeDocument);
      this.selectedFiles[typeDocument] = file;
      this.filePreviews[typeDocument] = file.type.startsWith('image/') ? dataUrl : null;
      this.saveEnrollmentState(typeDocument, dataUrl, file.name, file.type);
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
        sessionStorage.removeItem('academicEnrollmentState');
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
