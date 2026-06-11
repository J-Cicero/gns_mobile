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
    this.loadMockHistory();
  }

  loadMockHistory() {
    this.isLoading = true;
    setTimeout(() => {
      // Mock data pour l'historique marchand
      this.transactions = [
        { id: 1, etudiant: 'Koffi AMEGAVIE', montant: 1500, date: new Date(), type: 'Paiement' },
        { id: 2, etudiant: 'Fatimata DIOP', montant: 850, date: new Date(Date.now() - 3600000), type: 'Paiement' },
        { id: 3, etudiant: 'Abalo KOFFI', montant: 500, date: new Date(Date.now() - 7200000), type: 'Paiement' }
      ];
      this.isLoading = false;
    }, 1000);
  }
}