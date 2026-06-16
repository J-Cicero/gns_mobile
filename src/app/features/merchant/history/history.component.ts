import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, cashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-merchant-history',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  isLoading = true;

  constructor() {
    addIcons({ arrowBackOutline, calendarOutline, cashOutline });
  }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    // Vrai appel API à implementer (ex: this.walletService.getRecentTransactions(...))
    // Pour l'instant on laisse vide pour ne pas avoir de mock
    this.transactions = [];
    this.isLoading = false;
  }
}