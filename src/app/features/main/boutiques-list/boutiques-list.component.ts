import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoutiqueService } from '../../../core/services/boutique.service';
import { Boutique, Produit } from '../../../core/models/boutique.model';

@Component({
  selector: 'app-boutiques-list',
  templateUrl: './boutiques-list.component.html',
  styleUrls: ['./boutiques-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule]
})
export class BoutiquesListComponent implements OnInit {

  boutiques: Boutique[] = [];
  filteredBoutiques: Boutique[] = [];
  searchQuery = '';
  isLoading = true;
  
  // Modal State
  selectedBoutique: Boutique | null = null;
  produits: Produit[] = [];
  isLoadingProduits = false;
  isModalOpen = false;

  constructor(private boutiqueService: BoutiqueService) { }

  ngOnInit() {
    this.loadBoutiques();
  }

  loadBoutiques(event?: any) {
    this.isLoading = true;
    this.boutiqueService.getBoutiques(0, 50).subscribe({
      next: (res) => {
        this.boutiques = res.content || [];
        this.filteredBoutiques = [...this.boutiques];
        this.isLoading = false;
        if (event) event.target.complete();
      },
      error: () => {
        this.isLoading = false;
        if (event) event.target.complete();
      }
    });
  }

  filterBoutiques() {
    const q = this.searchQuery.toLowerCase();
    this.filteredBoutiques = this.boutiques.filter(b => 
      b.nom.toLowerCase().includes(q) || 
      (b.categorie && b.categorie.toLowerCase().includes(q))
    );
  }

  openDetails(boutique: Boutique) {
    this.selectedBoutique = boutique;
    this.isModalOpen = true;
    this.isLoadingProduits = true;

    this.boutiqueService.getProduitsByBoutique(boutique.trackingId).subscribe({
      next: (res) => {
        this.produits = res.content || [];
        this.isLoadingProduits = false;
      },
      error: () => {
        this.isLoadingProduits = false;
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    setTimeout(() => {
      this.selectedBoutique = null;
      this.produits = [];
    }, 300);
  }

  locateBoutique(boutique: Boutique, event?: Event) {
    if (event) event.stopPropagation();
    
    if (boutique.latitude && boutique.longitude) {
      // Ouverture de l'intent Google Maps
      const url = `https://www.google.com/maps/search/?api=1&query=${boutique.latitude},${boutique.longitude}`;
      window.open(url, '_system');
    } else {
      alert("Les coordonnées GPS ne sont pas disponibles pour cette boutique.");
    }
  }

  doRefresh(event: any) {
    this.loadBoutiques(event);
  }
}
