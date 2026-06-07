import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StudentWalletService } from '../../../core/services/student-wallet.service';
import { PaiementService } from '../../../core/services/paiement.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding bg-slate-900">
      <div *ngIf="wallet" class="animate-fade-in-up">
        <!-- Carte de Solde -->
        <div class="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl mb-6">
          <p class="text-indigo-100 text-sm font-medium">Solde disponible</p>
          <h2 class="text-4xl font-black mt-1">{{ wallet.solde | number:'1.0-0' }} FCFA</h2>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-xs bg-white/20 px-2 py-1 rounded-lg">Plafond: {{ wallet.plafond | number:'1.0-0' }} FCFA</span>
            <span class="text-xs font-bold uppercase">{{ wallet.statutWallet }}</span>
          </div>
        </div>

        <!-- Historique des transactions -->
        <h3 class="text-white font-bold mb-4">Activités récentes</h3>
        <div class="space-y-3">
          <div *ngFor="let t of transactions" class="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 flex justify-between items-center">
            <div>
              <p class="text-white font-bold text-sm">{{ t.typePaiement }}</p>
              <p class="text-slate-400 text-xs">{{ t.date | date:'dd/MM HH:mm' }}</p>
            </div>
            <p class="text-indigo-400 font-black text-sm">{{ t.montantDebite | number:'1.0-0' }} FCFA</p>
          </div>
        </div>
      </div>
      
      <div *ngIf="isLoading" class="text-center text-white">Chargement...</div>
    </ion-content>
  `
})
export class DashboardComponent implements OnInit {
  wallet: any = null;
  transactions: any[] = [];
  isLoading = true;

  constructor(
    private walletService: StudentWalletService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.walletService.getStudentWallet().subscribe(res => {
      this.wallet = res;
      this.isLoading = false;
    });
    
    // Récupérer les transactions
    this.paiementService.findAll().subscribe(res => {
      this.transactions = res.content || [];
    });
  }
}
