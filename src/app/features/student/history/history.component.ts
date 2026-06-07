import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PaiementService } from '../../../core/services/paiement.service';

@Component({
  selector: 'app-student-history',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding bg-slate-900">
      <div class="mb-8">
        <h1 class="text-3xl font-black text-white">Historique</h1>
        <p class="text-slate-400">Toutes vos transactions</p>
      </div>

      <div class="space-y-4">
        <div *ngFor="let t of transactions" class="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 flex justify-between items-center">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                 [ngClass]="t.typePaiement === 'SCOLARITE' ? 'bg-amber-900/30 text-amber-400' : 'bg-emerald-900/30 text-emerald-400'">
              <ion-icon [name]="t.typePaiement === 'SCOLARITE' ? 'school-outline' : 'cart-outline'" class="text-xl"></ion-icon>
            </div>
            <div>
              <p class="text-white font-bold text-sm">{{ t.typePaiement }}</p>
              <p class="text-slate-500 text-xs">{{ t.date | date:'dd MMM yyyy, HH:mm' }}</p>
            </div>
          </div>
          <p class="text-indigo-400 font-black">-{{ t.montantDebite | number:'1.0-0' }} FCFA</p>
        </div>

        <div *ngIf="transactions.length === 0" class="text-center py-20 text-slate-500 font-medium">
          Aucune transaction enregistrée.
        </div>
      </div>
    </ion-content>
  `
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  constructor(private paiementService: PaiementService) {}
  ngOnInit() {
    this.paiementService.findAll().subscribe(res => {
      this.transactions = res.content || [];
    });
  }
}
