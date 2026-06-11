import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  scanOutline, 
  schoolOutline, 
  arrowDownOutline, 
  arrowUpOutline, 
  notificationsOutline, 
  personCircleOutline,
  walletOutline,
  documentTextOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  wallet: any = null;
  transactions: any[] = [];
  isLoading = true;

  constructor() {
    // Initialisation des icônes
    addIcons({ scanOutline, schoolOutline, arrowDownOutline, arrowUpOutline, notificationsOutline, personCircleOutline, walletOutline, documentTextOutline });
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.isLoading = true;

    // Simulation d'un délai réseau (1.5 secondes) pour voir le spinner
    setTimeout(() => {
      
      // 1. Données Mockées pour la Carte Bancaire
      this.wallet = {
        typeWallet: 'Relais',
        statutWallet: 'Actif',
        solde: 32500,
        plafond: 36000
      };

      // 2. Données Mockées pour les Activités Récentes
      const maintenant = new Date();
      
      this.transactions = [
        {
          id: 1,
          typePaiement: 'Repas Campus (Resto U)',
          date: new Date(maintenant.getTime() - (1000 * 60 * 30)), // Il y a 30 mins
          montantDebite: 1500,
          montantCredite: null
        },
        {
          id: 2,
          typePaiement: 'Achat Librairie',
          date: new Date(maintenant.getTime() - (1000 * 60 * 60 * 24)), // Hier
          montantDebite: 4500,
          montantCredite: null
        },
        {
          id: 3,
          typePaiement: 'Versement Bourse DBS',
          date: new Date(maintenant.getTime() - (1000 * 60 * 60 * 72)), // Il y a 3 jours
          montantDebite: null,
          montantCredite: 36000
        }
      ];

      this.isLoading = false;
    }, 1500);
  }
}