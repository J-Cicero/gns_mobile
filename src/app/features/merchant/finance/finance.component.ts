import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, timeOutline, cashOutline, arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { MerchantService } from '../../../core/services/merchant.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FinanceComponent implements OnInit, OnDestroy {
  currentTab = 'ventes';

  transactions: any[] = [];
  isLoadingSales = false;
  private sub: Subscription | null = null;
  private boutiqueId: string | null = null;

  payouts = [
    { id: 'PAY-102', amount: 45000, date: new Date(Date.now() - 86400000), status: 'COMPLETED', reference: 'Virement SGBS' },
    { id: 'PAY-101', amount: 32000, date: new Date(Date.now() - 172800000), status: 'COMPLETED', reference: 'Virement Ecobank' }
  ];

  isWaiting = true;
  private pollingInterval: any;

  constructor(private merchantService: MerchantService) {
    addIcons({ checkmarkCircle, timeOutline, cashOutline, arrowDownOutline, arrowUpOutline });
  }

  ngOnInit() {
    this.sub = this.merchantService.selectedBoutiqueId$.subscribe(id => {
      this.boutiqueId = id;
      if (this.boutiqueId) {
        this.loadSalesHistory();
      } else {
        this.transactions = [];
      }
    });
  }

  loadSalesHistory() {
    if (!this.boutiqueId) return;
    this.isLoadingSales = true;
    this.merchantService.getSalesHistory(this.boutiqueId).subscribe({
      next: (res) => {
        this.transactions = res.content || [];
        this.isLoadingSales = false;
      },
      error: () => {
        this.isLoadingSales = false;
      }
    });
  }

  segmentChanged(event: any) {
    this.currentTab = event.detail.value;
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    if (this.sub) this.sub.unsubscribe();
  }

  receiveTransaction(tx: any) {
    this.isWaiting = false;
    this.transactions.unshift(tx);
    setTimeout(() => {
      this.isWaiting = true;
    }, 5000);
  }
}
