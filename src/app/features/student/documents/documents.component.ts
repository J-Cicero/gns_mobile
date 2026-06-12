import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cameraOutline, documentOutline, checkmarkCircleOutline, cloudUploadOutline } from 'ionicons/icons';
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

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ cameraOutline, documentOutline, checkmarkCircleOutline, cloudUploadOutline });
  }

  ngOnInit() {
    this.studentService.getActiveYear().subscribe({
      next: (year) => {
        this.activeYear = year;
      }
    });
  }

  takePhoto(type: 'RIB' | 'CARTE') {
    // Intégration de Capacitor Camera à ajouter ici.
    console.log(`Prendre une photo pour ${type}`);
    // Simuler un upload pour l'instant
    if (type === 'RIB') {
      this.ribFile = new File([''], 'rib.png');
    } else {
      this.carteFile = new File([''], 'carte.png');
    }
  }

  submitEnrollment() {
    if (!this.selectedNiveau || !this.activeYear) {
      return;
    }
    
    this.isLoading = true;
    const studentId = this.authService.getCurrentUserId();

    const inscriptionPayload = {
      studentTrackingId: studentId,
      anneeAcademique: this.activeYear.anneeAcademique,
      niveau: this.selectedNiveau,
      creditsTotalValides: 0,
      moyenneBac: 0,
      estBoursier: false,
      statut: 'EN_ATTENTE',
      source: 'APPLICATION_MOBILE'
    };

    this.studentService.createInscription(inscriptionPayload).subscribe({
      next: () => {
        // Idéalement on upload les documents en parallèle ou juste après
        // this.studentService.uploadDocument(...)
        this.isLoading = false;
        this.router.navigate(['/student/waiting']); // Rediriger vers l'attente
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
