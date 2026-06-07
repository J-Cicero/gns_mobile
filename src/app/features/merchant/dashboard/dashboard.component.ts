import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding bg-slate-900">
      <div class="mb-8">
        <h1 class="text-3xl font-black text-white">Bonjour Boutique !</h1>
        <p class="text-slate-400">Voici l'état de votre caisse aujourd'hui.</p>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-6 mb-8">
        <div class="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
          <p class="text-purple-100 text-sm font-medium">Solde en caisse</p>
          <h2 class="text-4xl font-black mt-1">128 500 FCFA</h2>
          <div class="mt-4 flex items-center text-xs bg-white/20 w-fit px-2 py-1 rounded-lg">
            <ion-icon name="trending-up-outline" class="mr-1"></ion-icon>
            +12% vs mois dernier
          </div>
        </div>

        <div class="bg-slate-800 rounded-3xl p-6 border border-slate-700">
          <div class="flex justify-between items-center mb-2">
            <span class="text-slate-400 text-sm font-bold uppercase tracking-wider">Plafond Quota</span>
            <span class="text-indigo-400 font-black">80%</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-3 mb-2">
            <div class="bg-indigo-500 h-3 rounded-full" style="width: 80%"></div>
          </div>
          <p class="text-xs text-slate-500">80 000 / 100 000 FCFA restants</p>
        </div>
      </div>

      <!-- Action Button -->
      <ion-button expand="block" color="primary" class="h-16 rounded-2xl font-black text-lg mb-8 shadow-lg shadow-indigo-500/20" (click)="goToCaisse()">
        <ion-icon name="add-circle-outline" slot="start"></ion-icon>
        NOUVELLE VENTE
      </ion-button>

      <!-- Ventes Récentes -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-white font-bold">Ventes récentes</h3>
        <button class="text-indigo-400 text-xs font-bold" (click)="goToHistory()">Voir tout</button>
      </div>
      
      <div class="space-y-3">
        <div class="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mr-3 text-white">
              <ion-icon name="receipt-outline"></ion-icon>
            </div>
            <div>
              <p class="text-white font-bold text-sm">Vente #1234</p>
              <p class="text-slate-500 text-xs">Aujourd'hui, 14:20</p>
            </div>
          </div>
          <p class="text-white font-black">4 500 FCFA</p>
        </div>
      </div>
    </ion-content>
  `
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}

  goToCaisse() {
    this.router.navigate(['/merchant/caisse']);
  }

  goToHistory() {
    this.router.navigate(['/merchant/history']);
  }
}
