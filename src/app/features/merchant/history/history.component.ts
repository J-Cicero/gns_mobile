import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MerchantService } from '../../../core/services/merchant.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding bg-slate-900">
      <h1 class="text-2xl font-black text-white mb-6">Historique des ventes</h1>
      <div class="space-y-3">
        <div *ngFor="let s of sales" class="bg-slate-800/50 p-4 rounded-2xl flex justify-between items-center border border-slate-700">
          <div>
            <p class="text-white font-bold text-sm">{{ s.date | date:'dd/MM HH:mm' }}</p>
            <p class="text-slate-400 text-xs">{{ s.itemsCount }} articles</p>
          </div>
          <p class="text-emerald-400 font-black text-lg">+{{ s.total }} FCFA</p>
        </div>
      </div>
    </ion-content>
  `
})
export class HistoryComponent implements OnInit {
  sales: any[] = [];
  constructor(private merchantService: MerchantService) {}
  ngOnInit() {
    this.merchantService.getSalesHistory('default-boutique-id').subscribe(res => this.sales = res);
  }
}
