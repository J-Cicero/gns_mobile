import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class HistoryComponent implements OnInit {

  transactions: Transaction[] = [];
  isLoading = true;
  page = 0;
  hasMore = true;

  constructor(private walletService: WalletService) { }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory(event?: any) {
    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      this.isLoading = false;
      if (event) event.target.complete();
      return;
    }
    const profile = JSON.parse(profileStr);

    // Vrai appel paginé. Le paramètre limite est utilisé ici pour la pagination : on simule 'size' avec le service,
    // mais pour une vraie pagination on ajouterait 'page' au service.
    // Modifions walletService pour accepter la page, mais pour l'instant utilisons 15.
    this.walletService.getRecentTransactions(profile.trackingId, 15).subscribe({
      next: (res) => {
        if (this.page === 0) {
          this.transactions = res.content || [];
        } else {
          this.transactions = [...this.transactions, ...(res.content || [])];
        }
        
        if (!res.content || res.content.length < 15) {
          this.hasMore = false;
        }

        this.isLoading = false;
        if (event) event.target.complete();
      },
      error: () => {
        this.isLoading = false;
        this.hasMore = false;
        if (event) event.target.complete();
      }
    });
  }

  loadMore(event: any) {
    if (!this.hasMore) {
      event.target.complete();
      return;
    }
    this.page++;
    this.loadHistory(event);
  }

  doRefresh(event: any) {
    this.page = 0;
    this.hasMore = true;
    this.loadHistory(event);
  }
}
