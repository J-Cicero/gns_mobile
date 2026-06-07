import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-student-scolarite',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding bg-slate-900">
      <div class="mb-8">
        <h1 class="text-3xl font-black text-white">Scolarité</h1>
        <p class="text-slate-400">Gérez vos frais universitaires</p>
      </div>

      <div class="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-white font-bold text-lg">Frais de scolarité UL</h2>
            <p class="text-slate-500 text-sm">Année Académique 2026-2027</p>
          </div>
          <span class="px-3 py-1 bg-amber-900/30 text-amber-400 text-xs font-black rounded-full border border-amber-800">EN ATTENTE</span>
        </div>
        
        <div class="py-4 border-y border-slate-700/50 mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-slate-400">Montant total :</span>
            <span class="text-white font-bold">30 000 FCFA</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Montant payé :</span>
            <span class="text-emerald-400 font-bold">0 FCFA</span>
          </div>
        </div>

        <ion-button expand="block" color="success" class="h-14 rounded-2xl font-black shadow-lg shadow-emerald-500/20">
          PAYER MA SCOLARITÉ
        </ion-button>
        <p class="text-center text-xs text-slate-500 mt-4 underline italic">Voir le détail des frais</p>
      </div>

      <!-- Alerte de blocage -->
      <div class="bg-red-900/20 border border-red-900/50 rounded-2xl p-4 flex items-start">
        <ion-icon name="alert-circle" class="text-red-500 text-2xl mr-3"></ion-icon>
        <div>
          <p class="text-red-200 text-sm font-bold">Action requise</p>
          <p class="text-red-300/80 text-xs mt-1">Vous devez valider votre inscription annuelle pour débloquer la tranche suivante.</p>
        </div>
      </div>
    </ion-content>
  `
})
export class ScolariteComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
