import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  storefrontOutline, 
  qrCodeOutline, 
  fastFoodOutline, 
  trendingUpOutline, 
  notificationsOutline, 
  personCircleOutline,
  receiptOutline,
  cashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-merchant-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  merchantWallet: any = null;
  recentSales: any[] = [];
  isLoading = true;

  constructor() {
    // Initialisation des icônes pro marchands
    addIcons({ storefrontOutline, qrCodeOutline, fastFoodOutline, trendingUpOutline, notificationsOutline, personCircleOutline, receiptOutline, cashOutline });
  }

  ngOnInit(): void {
    this.loadMerchantMockData();
  }

  loadMerchantMockData() {
    this.isLoading = true;

    // Simulation de chargement réseau fluide (1.2s)
    setTimeout(() => {
      
      // Données du commerce
      this.merchantWallet = {
        nomBoutique: 'Cafétéria Campus — Bloc L',
        statut: 'Agréé',
        soldeTotal: 184500,
        recettesDuJour: 42500,
        nombreVentesJour: 18
      };

      const maintenant = new Date();

      // Liste des derniers encaissements étudiants
      this.recentSales = [
        {
          id: 101,
          etudiant: 'Koffi S. AMEGAVIE',
          matricule: '245-UL-2025',
          details: 'Formule Plat + Boisson',
          date: new Date(maintenant.getTime() - (1000 * 60 * 12)), // Il y a 12 mins
          montant: 1500
        },
        {
          id: 102,
          etudiant: 'Fatimata DIOP',
          matricule: '188-UL-2024',
          details: 'Petit Déjeuner Complet',
          date: new Date(maintenant.getTime() - (1000 * 60 * 45)), // Il y a 45 mins
          montant: 850
        },
        {
          id: 103,
          etudiant: 'Abalo E. KOFFI',
          matricule: '312-UL-2025',
          details: 'Achat Ticket Resto U',
          date: new Date(maintenant.getTime() - (1000 * 60 * 120)), // Il y a 2h
          montant: 500
        }
      ];

      this.isLoading = false;
    }, 1200);
  }
}