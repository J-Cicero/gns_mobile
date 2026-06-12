import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { walletOutline, arrowUpOutline, arrowDownOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class WalletComponent implements OnInit {
  balance = 150000;
  transactions = [
    { type: 'DEBIT', amount: 2500, date: new Date(), description: 'Paiement Boutique GNS' },
    { type: 'CREDIT', amount: 50000, date: new Date(Date.now() - 86400000), description: 'Bourse de Janvier' }
  ];

  constructor() {
    addIcons({ walletOutline, arrowUpOutline, arrowDownOutline, timeOutline });
  }

  ngOnInit() {
    // Fetch wallet data via StudentWalletService here
  }
}
