import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent
 } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { TransactionResponse } from '../../../core/models/transaction.model'; // Updated import
import { Page } from '../../../core/models/page.model'; // Import Page
import { StudentProfile } from '../../../core/models/student.model'; // Import StudentProfile for profile.trackingId

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonContent, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent
  ]
})
export class HistoryComponent implements OnInit {

  transactions: TransactionResponse[] = []; // Updated type
  isLoading = true;
  errorMessage = '';
  page = 0;
  private readonly PAGE_SIZE = 10; // Define page size
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
    const profile: StudentProfile = JSON.parse(profileStr); // Cast to StudentProfile

    this.walletService.getRecentTransactions(profile.trackingId, this.page, this.PAGE_SIZE).subscribe({ // Use page and PAGE_SIZE
      next: (res: Page<TransactionResponse>) => { // Updated type
        if (this.page === 0) {
          this.transactions = res.content || [];
        } else {
          this.transactions = [...this.transactions, ...(res.content || [])];
        }
        
        this.hasMore = res.last === false; // Update hasMore based on backend response

        this.isLoading = false;
        if (event) event.target.complete();
      },
      error: () => {
        this.isLoading = false;
        this.hasMore = false;
        this.errorMessage = "Le serveur est temporairement inaccessible. Veuillez réessayer plus tard.";
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
