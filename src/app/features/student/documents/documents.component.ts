import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, documentOutline, checkmarkCircleOutline, cloudUploadOutline, refreshOutline, cardOutline, checkmarkCircle } from 'ionicons/icons';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class DocumentsComponent implements OnInit {
  ribFile: File | null = null;
  carteFile: File | null = null;
  selectedNiveau: string = '';
  isLoading = false;
  activeYear: any = null;
  currentInscription: any = null;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    addIcons({ cameraOutline, documentOutline, checkmarkCircleOutline, cloudUploadOutline, refreshOutline, cardOutline, checkmarkCircle });
  }

  ngOnInit() {
    const studentId = this.authService.getCurrentUserId();
    this.studentService.getActiveYear().subscribe({
      next: (year) => {
        this.activeYear = year;
        if (studentId && year.libelle) {
          this.loadExistingInscription(studentId, year.libelle);
        }
      }
    });
  }

  loadExistingInscription(studentId: string, yearLibelle: string) {
    this.studentService.getInscriptionByYear(studentId, yearLibelle).subscribe({
      next: (ins) => {
        this.currentInscription = ins;
        if (ins.niveau) {
          this.selectedNiveau = ins.niveau.replace('_ANNEE', '');
        }
        // Redirection automatique si inscription déjà existante
        if (!ins.estEligibleBourse) {
          this.navCtrl.navigateRoot('/student/eligibility');
        } else {
          this.navCtrl.navigateRoot('/student/wallet');
        }
      },
      error: () => this.currentInscription = null
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.carteFile = file;
    }
  }

  takePhoto(type: 'RIB' | 'CARTE') {
    // Cette méthode peut maintenant être connectée à Capacitor Camera
    console.log(`Action pour ${type}`);
  }

  submitEnrollment() {
    if (!this.selectedNiveau || !this.activeYear || !this.carteFile) return;
    
    const studentId = this.authService.getCurrentUserId();
    if (!studentId) {
      this.toastCtrl.create({
        message: "Erreur: ID étudiant non trouvé. Veuillez vous reconnecter.",
        duration: 3000, color: 'danger', position: 'top'
      }).then(t => t.present());
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    const request = {
      studentTrackingId: studentId,
      niveau: this.selectedNiveau + '_ANNEE'
    };

    formData.append('request', JSON.stringify(request));
    formData.append('carte', this.carteFile);

    this.studentService.createInscription(formData).subscribe({
      next: (res) => {
        this.currentInscription = res;
        this.isLoading = false;
        this.navCtrl.navigateRoot('/student/eligibility');
      },
      error: async (err) => {
        console.error(err);
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: "Erreur lors de l'upload de la carte. Vérifiez la taille.",
          duration: 3000, color: 'danger', position: 'top'
        });
        toast.present();
      }
    });
  }

  checkEligibility() {
    if (!this.currentInscription) return;
    
    this.isLoading = true;
    this.studentService.synchronizeInscription(this.currentInscription.trackingId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.estEligibleBourse) {
          this.navCtrl.navigateRoot('/student/wallet');
        } else {
          this.toastCtrl.create({
            message: "Désolé, vous n'êtes pas éligible à l'aide pour cette année.",
            duration: 3000, color: 'warning', position: 'top'
          }).then(t => t.present());
        }
      },
      error: () => this.isLoading = false
    });
  }
}
