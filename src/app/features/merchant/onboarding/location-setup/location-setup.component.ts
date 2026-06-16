import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MerchantService } from '../../../../core/services/merchant.service';
import { MerchantProfile, Boutique } from '../../../../core/models/merchant.model';

@Component({
  selector: 'app-merchant-location-setup',
  templateUrl: './location-setup.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LocationSetupComponent implements OnInit {

  merchantProfile: MerchantProfile | null = null;
  
  boutiqueData: Partial<Boutique> = {
    nom: '',
    adresse: '',
    categorie: '',
    telephone: '',
    statutBoutique: 'OUVERT'
  };

  isLocating = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private merchantService: MerchantService
  ) {}

  ngOnInit() {
    const profileStr = localStorage.getItem('merchant_profile');
    if (!profileStr) {
      this.router.navigate(['/merchant/onboarding/register']);
      return;
    }
    this.merchantProfile = JSON.parse(profileStr);
  }

  getCurrentLocation() {
    this.isLocating = true;
    this.errorMessage = '';

    if (!navigator.geolocation) {
      this.isLocating = false;
      this.errorMessage = "La géolocalisation n'est pas supportée par votre navigateur.";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.boutiqueData.latitude = position.coords.latitude;
        this.boutiqueData.longitude = position.coords.longitude;
        this.isLocating = false;
      },
      (error) => {
        this.isLocating = false;
        this.errorMessage = "Impossible de récupérer votre position. Vérifiez vos autorisations.";
      }
    );
  }

  onSubmit() {
    if (!this.boutiqueData.nom || !this.boutiqueData.adresse) {
      this.errorMessage = "Veuillez renseigner au moins le nom et l'adresse de la boutique.";
      return;
    }

    if (!this.merchantProfile || !this.merchantProfile.trackingId) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    this.boutiqueData.merchantTrackingId = this.merchantProfile.trackingId;

    this.merchantService.createBoutique(this.boutiqueData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        
        // Mettre à jour le statut du profil pour indiquer la fin de l'onboarding
        if (this.merchantProfile) {
          this.merchantProfile.isOnboardingComplete = true;
          localStorage.setItem('merchant_profile', JSON.stringify(this.merchantProfile));
        }

        this.router.navigate(['/merchant/onboarding/waiting-screen']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement de la boutique.";
      }
    });
  }
}
