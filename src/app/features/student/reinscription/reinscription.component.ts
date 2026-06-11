import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  schoolOutline, 
  ribbonOutline, 
  cloudUploadOutline, 
  arrowBackOutline, 
  checkmarkOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-reinscription',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './reinscription.component.html',
  styleUrls: ['./reinscription.component.scss']
})
export class ReinscriptionComponent {
  step = 1;
  formData = {
    niveau: '',
    creditsTotalValides: null,
    anneeAcademique: '2026-2027'
  };
  isLoading = false;

  constructor(private router: Router) {
    addIcons({ schoolOutline, ribbonOutline, cloudUploadOutline, arrowBackOutline, checkmarkOutline });
  }

  nextStep() {
    // Petite validation rapide avant de passer à l'étape 2
    if (this.formData.niveau && this.formData.creditsTotalValides !== null) {
      this.step = 2;
    }
  }

  prevStep() {
    this.step = 1;
  }

  submit() {
    this.isLoading = true;
    
    // Simulation de l'appel API pour le design
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/student']);
    }, 1500);
  }
}