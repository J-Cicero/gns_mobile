import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  schoolOutline, 
  cartOutline, 
  cafeOutline, 
  arrowUpOutline, 
  arrowDownOutline,
  cashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-student-history',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  isLoading = true;

  constructor() {
    // Enregistrement des icônes pour le thème
    addIcons({ arrowBackOutline, schoolOutline, cartOutline, cafeOutline, arrowUpOutline, arrowDownOutline, cashOutline });
  }

  ngOnInit() {
    this.loadMockTransactions();
  }

  loadMockTransactions() {
    this.isLoading = true;

    // Simulation d'un petit temps de chargement fluide
    setTimeout(() => {
      const maintenant = new Date();

      this.transactions = [
        {
          id: 1,
          libelle: 'Frais de Scolarité — Université de Lomé',
          categorie: 'SCOLARITE',
          date: new Date(maintenant.getTime() - (1000 * 60 * 60 * 2)), // Il y a 2h
          montantDebite: 25000,
          montantCredite: null
        },
        {
          id: 2,
          libelle: 'Repas Campus (Resto U)',
          categorie: 'REPAS',
          date: new Date(maintenant.getTime() - (1000 * 60 * 60 * 5)), // Il y a 5h
          montantDebite: 1500,
          montantCredite: null
        },
        {
          id: 3,
          libelle: 'Avancement Bourse Tranche DBS',
          categorie: 'BOURSE',
          date: new Date(maintenant.getTime() - (1000 * 60 * 60 * 24 * 2)), // Il y a 2 jours
          montantDebite: null,
          montantCredite: 36000
        },
        {
          id: 4,
          libelle: 'Achat Polycopiés (Librairie Campus)',
          categorie: 'ACHAT',
          date: new Date(maintenant.getTime() - (1000 * 60 * 60 * 24 * 4)), // Il y a 4 jours
          montantDebite: 3200,
          montantCredite: null
        }
      ];

      this.isLoading = false;
    }, 1200);
  }
}