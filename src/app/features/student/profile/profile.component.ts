import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { BanqueService } from '../../../core/services/banque.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding bg-slate-900 text-white">
      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-black mb-4">
          {{ user?.prenom?.charAt(0) }}{{ user?.nom?.charAt(0) }}
        </div>
        <h2 class="text-xl font-bold">{{ user?.prenom }} {{ user?.nom }}</h2>
        <p class="text-slate-400 text-sm">{{ user?.email }}</p>
      </div>

      <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
        <div class="flex justify-between border-b border-slate-700 pb-2">
          <span class="text-slate-400">Statut</span>
          <span class="font-bold text-emerald-400">Boursier Validé</span>
        </div>
        <div class="flex justify-between border-b border-slate-700 pb-2" *ngIf="banque">
          <span class="text-slate-400">Banque</span>
          <span class="font-bold">{{ banque.banque.nom }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Matricule</span>
          <span class="font-bold">...</span>
        </div>
      </div>

      <ion-button expand="block" color="danger" class="mt-8" (click)="logout()">Déconnexion</ion-button>
    </ion-content>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  banque: any = null;

  constructor(private authService: AuthService, private banqueService: BanqueService) {}

  ngOnInit() {
    // Dans une vraie implémentation, on récupérerait l'utilisateur depuis un Store ou AuthService
    // Ici on suppose qu'il est stocké dans le localStorage ou via une API
    // Pour l'exemple, nous appelons le endpoint de profil
  }
  
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
