import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MerchantService } from '../../../core/services/merchant.service';

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-content class="ion-padding bg-slate-900">
      <div class="mb-6">
        <h1 class="text-2xl font-black text-white">Nouvelle Vente</h1>
        <p class="text-slate-400 text-sm">Sélectionnez les articles pour le panier</p>
      </div>

      <!-- Grille Produits -->
      <div class="grid grid-cols-2 gap-4">
        <div *ngFor="let p of products" class="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
          <div class="h-24 bg-slate-700 rounded-xl mb-3 flex items-center justify-center">
            <ion-icon name="cart-outline" class="text-3xl text-slate-500"></ion-icon>
          </div>
          <h3 class="text-white font-bold text-sm">{{ p.nom }}</h3>
          <p class="text-indigo-400 font-black text-lg">{{ p.prix }} FCFA</p>
          <ion-button expand="block" fill="outline" class="mt-2 text-xs" (click)="addToCart(p)">Ajouter</ion-button>
        </div>
      </div>

      <!-- Panier (Overlay bas) -->
    <div class="fixed bottom-0 left-0 right-0 bg-slate-800 p-4 border-t border-slate-700 rounded-t-3xl">
        <div class="flex justify-between items-center mb-4 text-white">
          <span class="font-bold">Total :</span>
          <span class="font-black text-xl">{{ calculateTotal() }} FCFA</span>
        </div>
        <ion-button expand="block" color="primary" [disabled]="cart.length === 0" (click)="pay()">Passer au paiement</ion-button>
      </div>

      <!-- Modal PIN -->
      <div *ngIf="showPinModal" class="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-6">
        <div class="bg-slate-800 rounded-3xl p-6 w-full max-w-sm border border-slate-700">
          <h2 class="text-white text-lg font-bold text-center mb-4">Saisir le Code PIN Étudiant</h2>
          <ion-item class="mb-4">
            <ion-input type="password" [(ngModel)]="pinCode" placeholder="****" class="text-center text-2xl tracking-widest"></ion-input>
          </ion-item>
          <div class="flex gap-3">
            <ion-button expand="block" fill="clear" (click)="closePinModal()">Annuler</ion-button>
            <ion-button expand="block" (click)="confirmPayment()">Valider</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `
})
export class CaisseComponent implements OnInit {
  products: any[] = [];
  cart: any[] = [];

  constructor(private merchantService: MerchantService) {}

  ngOnInit() {
    // Mock boutiqueId pour la démo
    this.merchantService.getProducts('default-boutique-id').subscribe(res => {
      this.products = res;
    });
  }

  showPinModal = false;
  pinCode = '';

  addToCart(product: any) {
    this.cart.push(product);
  }

  calculateTotal() {
    return this.cart.reduce((sum, p) => sum + p.prix, 0);
  }

  pay() {
    this.showPinModal = true;
  }

  closePinModal() {
    this.showPinModal = false;
    this.pinCode = '';
  }

  confirmPayment() {
    const orderData = {
      items: this.cart,
      total: this.calculateTotal(),
      pinCode: this.pinCode
    };

    this.merchantService.createOrder(orderData).subscribe({
      next: () => {
        this.cart = [];
        this.closePinModal();
        alert('Paiement validé avec succès !');
      },
      error: (err) => {
        alert('Erreur lors du paiement : ' + (err.error?.message || 'Code PIN invalide'));
      }
    });
  }
}
