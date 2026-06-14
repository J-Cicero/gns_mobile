import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, pricetagOutline } from 'ionicons/icons';
import { MerchantService } from '../../../core/services/merchant.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit, OnDestroy {
  produits: any[] = [];
  isLoading = false;
  private sub: Subscription | null = null;
  private boutiqueId: string | null = null;

  constructor(
    private router: Router, 
    private merchantService: MerchantService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, arrowBackOutline, pricetagOutline });
  }

  ngOnInit() {
    this.sub = this.merchantService.selectedBoutiqueId$.subscribe(id => {
      this.boutiqueId = id;
      if (this.boutiqueId) {
        this.loadProducts();
      } else {
        this.produits = [];
      }
    });
  }

  loadProducts() {
    if (!this.boutiqueId) return;
    this.isLoading = true;
    this.merchantService.getProducts(this.boutiqueId).subscribe({
      next: (res) => {
        this.produits = res.content || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  utiliserPourEncaisser(prix: number) {
    this.router.navigate(['/merchant/caisse'], { queryParams: { montant: prix } });
  }

  async creerProduit() {
    if (!this.boutiqueId) {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez sélectionner une boutique dans le Profil',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Nouveau Produit',
      inputs: [
        {
          name: 'nom',
          type: 'text',
          placeholder: 'Nom du produit (ex: Plat du jour)'
        },
        {
          name: 'prix',
          type: 'number',
          placeholder: 'Prix (ex: 1500)'
        }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { 
          text: 'Créer', 
          handler: (data) => {
            if (data.nom && data.prix) {
              this.merchantService.addProduct(this.boutiqueId!, {
                nom: data.nom,
                prix: parseFloat(data.prix),
                estDisponible: true
              }).subscribe({
                next: () => {
                  this.loadProducts();
                },
                error: async () => {
                  const toast = await this.toastCtrl.create({
                    message: 'Erreur lors de la création du produit',
                    duration: 2000,
                    color: 'danger'
                  });
                  toast.present();
                }
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }
}