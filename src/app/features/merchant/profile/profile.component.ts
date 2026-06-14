import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { MerchantService } from '../../../core/services/merchant.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-merchant-profile',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding bg-slate-900 text-white">
      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-black mb-4">
          <ion-icon name="storefront-outline"></ion-icon>
        </div>
        <h2 class="text-xl font-bold">{{ boutique?.nomBoutique || (user?.nom + ' ' + user?.prenom) || 'Ma Boutique' }}</h2>
        <p class="text-slate-400 text-sm">{{ user?.email }}</p>
      </div>

      <div *ngIf="isLoading" class="flex justify-center my-8">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>

      <div *ngIf="!isLoading" class="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
        <div class="flex justify-between border-b border-slate-700 pb-2">
          <span class="text-slate-400">Statut Partenaire</span>
          <span class="font-bold text-emerald-400">{{ boutique?.statutKYC === 'VALIDEE' ? 'Validé' : (boutique?.statutKYC || 'En attente') }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-700 pb-2">
          <span class="text-slate-400">RCCM</span>
          <span class="font-bold text-slate-200">{{ boutique?.rccm || 'Non renseigné' }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-700 pb-2">
          <span class="text-slate-400">Téléphone</span>
          <span class="font-bold text-slate-200">{{ user?.telephone || 'Non renseigné' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Catégorie</span>
          <span class="font-bold text-slate-200">{{ boutique?.categorieShop || 'Général' }}</span>
        </div>
      </div>

      <div class="mt-8 space-y-4">
        <ion-item class="bg-slate-800 rounded-xl border border-slate-700" lines="none">
          <ion-icon name="moon-outline" slot="start" class="text-indigo-400"></ion-icon>
          <ion-label class="text-white">Mode Sombre</ion-label>
          <ion-toggle slot="end" [checked]="true"></ion-toggle>
        </ion-item>
      </div>

      <ion-button expand="block" color="danger" class="mt-8 rounded-xl font-bold" (click)="logout()">
        Se déconnecter de la caisse
      </ion-button>
    </ion-content>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  boutique: any = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private merchantService: MerchantService
  ) {}

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.isLoading = true;
    forkJoin([
      this.authService.getUserByTrackingId(userId),
      this.merchantService.getBoutiqueByMerchant(userId)
    ]).subscribe({
      next: ([userRes, boutiqueRes]) => {
        this.user = userRes;
        this.boutique = Array.isArray(boutiqueRes.content) ? boutiqueRes.content[0] : boutiqueRes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
