import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions = [
    { id: 'TRX-901', amount: 1500, date: new Date(), status: 'SUCCESS', student: '2023-A01' },
    { id: 'TRX-900', amount: 3000, date: new Date(Date.now() - 3600000), status: 'SUCCESS', student: '2024-B02' }
  ];

  isWaiting = true;
  pollingInterval: any;

  constructor() {
    addIcons({ checkmarkCircle, timeOutline });
  }

  ngOnInit() {
    // Simulation de réception d'une transaction via WebSocket ou Polling
    this.pollingInterval = setInterval(() => {
      // Simuler une nouvelle transaction après 10 secondes
      if (this.isWaiting && Math.random() > 0.8) {
        this.receiveTransaction({
          id: `TRX-${Math.floor(Math.random() * 1000)}`,
          amount: 2500,
          date: new Date(),
          status: 'SUCCESS',
          student: 'Nouveau Scanner'
        });
      }
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  receiveTransaction(tx: any) {
    this.isWaiting = false;
    this.transactions.unshift(tx);
    // On remet en attente après 5 secondes d'affichage du succès
    setTimeout(() => {
      this.isWaiting = true;
    }, 5000);
  }
}
