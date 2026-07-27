import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonRefresher, IonRefresherContent, IonModal, ToastController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoutiqueService } from '../../../core/services/boutique.service';
import { Boutique, Produit } from '../../../core/models/boutique.model';

@Component({
  selector: 'app-boutiques-list',
  templateUrl: './boutiques-list.component.html',
  styleUrls: ['./boutiques-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    IonContent, IonRefresher, IonRefresherContent, IonModal
  ]
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

  constructor(
    private boutiqueService: BoutiqueService,
    private toastController: ToastController
  ) { }

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
      b.name.toLowerCase().includes(q) || 
      (b.description && b.description.toLowerCase().includes(q))
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

  async locateBoutique(boutique: Boutique, event?: Event) {
    if (event) event.stopPropagation();

    if (boutique.latitude && boutique.longitude) {
      // ✅ Ouvrir Google Maps avec le trajet de navigation (depuis position actuelle → boutique)
      // Le format `dir/` ouvre directement les directions dans Google Maps
      const destination = `${boutique.latitude},${boutique.longitude}`;
      const label = encodeURIComponent(boutique.name || 'Boutique');
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=&travelmode=walking`;

      // Sur mobile Capacitor, _system ouvre le navigateur natif
      window.open(mapsUrl, '_system');
    } else {
      const toast = await this.toastController.create({
        message: `📍 "${boutique.name}" n'a pas encore partagé sa localisation GPS.`,
        duration: 3000,
        color: 'warning',
        position: 'top',
        buttons: [{ icon: 'close', role: 'cancel' }]
      });
      await toast.present();
    }
  }

  doRefresh(event: any) {
    this.loadBoutiques(event);
  }
}
