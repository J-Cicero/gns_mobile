import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MerchantService } from '../../../core/services/merchant.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-content class="ion-padding bg-slate-900">
      <h1 class="text-2xl font-black text-white mb-6">Catalogue</h1>
      <div class="grid grid-cols-2 gap-4">
        <div *ngFor="let p of products" class="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center">
          <h3 class="text-white font-bold">{{ p.nom }}</h3>
          <p class="text-indigo-400 font-black">{{ p.prix }} FCFA</p>
        </div>
      </div>
      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button (click)="showAddForm = true">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `
})
export class CatalogueComponent implements OnInit {
  products: any[] = [];
  showAddForm = false;
  constructor(private merchantService: MerchantService) {}
  ngOnInit() {
    this.merchantService.getProducts('default-boutique-id').subscribe(res => this.products = res);
  }
}
