import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';

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
        <h2 class="text-xl font-bold">{{ boutique?.nomBoutique || 'Ma Boutique' }}</h2>
        <p class="text-slate-400 text-sm">{{ user?.email }}</p>
      </div>

      <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
        <div class="flex justify-between border-b border-slate-700 pb-2">
          <span class="text-slate-400">Statut Partenaire</span>
          <span class="font-bold text-emerald-400">Validé</span>
        </div>
        <div class="flex justify-between border-b border-slate-700 pb-2">
          <span class="text-slate-400">RCCM</span>
          <span class="font-bold text-slate-200">RC-ABJ-2026-B-1234</span>
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Logique de récupération des données utilisateur/boutique
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
