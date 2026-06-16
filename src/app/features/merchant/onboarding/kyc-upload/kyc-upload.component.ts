import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MerchantProfile } from '../../../../core/models/merchant.model';
import { MerchantService } from '../../../../core/services/merchant.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchant-kyc-upload',
  templateUrl: './kyc-upload.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class KycUploadComponent implements OnInit {

  merchantProfile: MerchantProfile | null = null;
  selectedFile: File | null = null;
  documentType = 'REGISTRE_COMMERCE'; // Par défaut
  isUploading = false;
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadDocument() {
    if (!this.selectedFile) {
      this.errorMessage = "Veuillez sélectionner un document (RCCM, Pièce d'identité, etc.)";
      return;
    }
    if (!this.merchantProfile || !this.merchantProfile.trackingId) {
      this.errorMessage = "Profil introuvable.";
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';

    this.merchantService.uploadDocument(this.merchantProfile.trackingId, this.documentType, this.selectedFile).subscribe({
      next: (res) => {
        // Rafraîchir le profil depuis le backend pour obtenir le statut KYC mis à jour
        if (this.merchantProfile) {
          this.merchantService.getMerchantProfile(this.merchantProfile.trackingId).subscribe({
            next: (profile) => {
              this.isUploading = false;
              localStorage.setItem('merchant_profile', JSON.stringify(profile));
              this.router.navigate(['/merchant/onboarding/location-setup']);
            },
            error: (err) => {
              this.isUploading = false;
              // Fallback
              this.router.navigate(['/merchant/onboarding/location-setup']);
            }
          });
        } else {
          this.isUploading = false;
          this.router.navigate(['/merchant/onboarding/location-setup']);
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'upload du document.";
      }
    });
  }
}
