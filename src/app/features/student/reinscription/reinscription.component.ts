import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InscriptionAnnuelleService } from '../../../core/services/inscription-annuelle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reinscription',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './reinscription.component.html'
})
export class ReinscriptionComponent {
  step = 1;
  formData = {
    niveau: '',
    creditsTotalValides: 0,
    anneeAcademique: '2026-2027'
  };
  isLoading = false;

  constructor(private inscriptionService: InscriptionAnnuelleService, private router: Router) {}

  nextStep() {
    this.step = 2;
  }

  submit() {
    this.isLoading = true;
    this.inscriptionService.create(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Réinscription soumise avec succès !');
        this.router.navigate(['/student']);
      },
      error: () => {
        this.isLoading = false;
        alert('Erreur lors de la soumission.');
      }
    });
  }
}
