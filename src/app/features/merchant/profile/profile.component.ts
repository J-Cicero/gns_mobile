import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { MerchantService } from '../../../core/services/merchant.service';
import { forkJoin, Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { storefrontOutline, checkmarkCircleOutline, logOutOutline, addCircleOutline, locationOutline, navigateOutline, createOutline } from 'ionicons/icons';

@Component({
  selector: 'app-merchant-profile',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding premium-dark-bg">
      <div class="flex flex-col items-center mb-8 mt-4">
        <div class="w-24 h-24 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-4xl text-white shadow-lg shadow-indigo-500/30 mb-4">
          <ion-icon name="storefront-outline"></ion-icon>
        </div>
        <h2 class="text-2xl font-bold text-white">{{ merchantProfile?.firstName }} {{ merchantProfile?.lastName }}</h2>
        <p class="text-slate-400 text-sm">{{ merchantProfile?.businessName || 'Espace Marchand' }}</p>
        <div *ngIf="merchantProfile?.kycStatus" class="mt-2 text-xs px-3 py-1 rounded-full font-bold uppercase"
             [ngClass]="{
               'bg-yellow-500/20 text-yellow-400': merchantProfile?.kycStatus === 'PENDING',
               'bg-emerald-500/20 text-emerald-400': merchantProfile?.kycStatus === 'VALIDATED',
               'bg-red-500/20 text-red-400': merchantProfile?.kycStatus === 'REJECTED'
             }">
          KYC: {{ merchantProfile?.kycStatus }}
        </div>
      </div>

      <div *ngIf="isLoading" class="flex justify-center my-8">
        <ion-spinner name="crescent" color="success"></ion-spinner>
      </div>

      <div *ngIf="!isLoading && boutiques.length > 0" class="mb-8">
        <h3 class="text-lg font-bold text-slate-200 mb-4 px-2">Sélectionner une boutique</h3>
        
        <div class="space-y-3">
          <div *ngFor="let bout of boutiques" 
               (click)="selectBoutique(bout.trackingId)"
               [class.border-emerald-500]="selectedBoutiqueId === bout.trackingId"
               [class.bg-emerald-500]="selectedBoutiqueId === bout.trackingId"
               [class.bg-opacity-10]="selectedBoutiqueId === bout.trackingId"
               class="bg-slate-800 rounded-2xl p-4 border border-slate-700 transition-all cursor-pointer flex justify-between items-center hover:bg-slate-700">
            <div>
              <h4 class="font-bold text-white text-lg">{{ bout.nom }}</h4>
              <p class="text-sm text-slate-400">{{ bout.categorie || 'Général' }} • {{ bout.statutBoutique }}</p>
            </div>
            <div class="flex items-center gap-2">
              <ion-button fill="clear" (click)="modifierBoutique(bout, $event)" class="m-0 h-8 text-slate-400 hover:text-white">
                <ion-icon name="create-outline" slot="icon-only"></ion-icon>
              </ion-button>
              <ion-icon *ngIf="selectedBoutiqueId === bout.trackingId" 
                        name="checkmark-circle-outline" 
                        class="text-emerald-500 text-3xl">
              </ion-icon>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && boutiques.length === 0" class="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center mb-8">
        <p class="text-slate-400">Aucune boutique trouvée pour ce marchand.</p>
      </div>

      <div class="space-y-4 mb-8">
        <ion-button expand="block" class="premium-btn location-btn" (click)="initialiserPosition()" [disabled]="isLocating || !selectedBoutiqueId">
          <ion-spinner *ngIf="isLocating" name="crescent"></ion-spinner>
          <span *ngIf="!isLocating">
            <ion-icon name="navigate-outline" slot="start"></ion-icon> Initialiser ma position (GPS)
          </span>
        </ion-button>

        <ion-button expand="block" class="premium-btn create-btn" (click)="creerBoutique()">
          <ion-icon name="add-circle-outline" slot="start"></ion-icon>
          Créer une nouvelle boutique
        </ion-button>
      </div>

      <ion-button expand="block" color="danger" class="mt-8 rounded-xl font-bold premium-btn" (click)="logout()">
        <ion-icon slot="start" name="log-out-outline"></ion-icon>
        Se déconnecter
      </ion-button>
    </ion-content>
  `,
  styles: [`
    .premium-dark-bg { --background: var(--ion-background-color, #0f172a); }
    .premium-btn { --border-radius: 16px; height: 56px; margin: 0; font-size: 14px; font-weight: 600; }
    .location-btn { --background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
    .create-btn { --background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
  `]
})
export class ProfileComponent implements OnInit {
  merchantProfile: any = null;
  boutiques: any[] = [];
  selectedBoutiqueId: string | null = null;
  isLoading = true;
  isLocating = false;
  private sub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private merchantService: MerchantService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ storefrontOutline, checkmarkCircleOutline, logOutOutline, addCircleOutline, locationOutline, navigateOutline, createOutline });
  }

  ngOnInit() {
    this.sub = this.merchantService.selectedBoutiqueId$.subscribe(id => {
      this.selectedBoutiqueId = id;
    });
    this.loadProfileData();
  }

  loadProfileData() {
    const profileStr = localStorage.getItem('merchant_profile');
    if (!profileStr) return;
    
    this.merchantProfile = JSON.parse(profileStr);
    const trackingId = this.merchantProfile.trackingId;

    this.isLoading = true;
    forkJoin([
      this.merchantService.getMerchantProfile(trackingId),
      this.merchantService.getBoutiquesByMerchant(trackingId)
    ]).subscribe({
      next: ([profileRes, boutiqueRes]) => {
        this.merchantProfile = profileRes;
        localStorage.setItem('merchant_profile', JSON.stringify(profileRes));
        
        this.boutiques = boutiqueRes.content || boutiqueRes || [];
        
        // Auto-select first boutique if none is selected
        if (!this.selectedBoutiqueId && this.boutiques.length > 0) {
          this.merchantService.setSelectedBoutiqueId(this.boutiques[0].trackingId);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectBoutique(id: string) {
    this.merchantService.setSelectedBoutiqueId(id);
  }

  async creerBoutique() {
    const alert = await this.alertCtrl.create({
      header: 'Nouvelle Boutique',
      cssClass: 'premium-alert',
      inputs: [
        {
          name: 'nomBoutique',
          type: 'text',
          placeholder: 'Nom de la boutique'
        },
        {
          name: 'categorieShop',
          type: 'text',
          placeholder: 'Catégorie (ex: Restauration, Mode...)'
        }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel', cssClass: 'text-slate-400' },
        {
          text: 'Créer',
          cssClass: 'text-emerald-500 font-bold',
          handler: (data) => {
            if (!data.nomBoutique) {
              this.showToast('Le nom de la boutique est obligatoire.', 'warning');
              return false;
            }
            
            const payload = {
              merchantTrackingId: this.merchantProfile.trackingId,
              nom: data.nomBoutique,
              categorie: data.categorieShop || 'Général',
              statutBoutique: 'OUVERT'
            };

            this.merchantService.createBoutique(payload).subscribe({
              next: () => {
                this.showToast('Boutique créée avec succès !', 'success');
                this.loadProfileData(); // Reload list
              },
              error: () => {
                this.showToast('Erreur lors de la création.', 'danger');
              }
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async modifierBoutique(bout: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Modifier Boutique',
      cssClass: 'premium-alert',
      inputs: [
        {
          name: 'nomBoutique',
          type: 'text',
          value: bout.nom,
          placeholder: 'Nom de la boutique'
        },
        {
          name: 'categorieShop',
          type: 'text',
          value: bout.categorie,
          placeholder: 'Catégorie (ex: Restauration, Mode...)'
        }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel', cssClass: 'text-slate-400' },
        {
          text: 'Enregistrer',
          cssClass: 'text-emerald-500 font-bold',
          handler: (data) => {
            if (!data.nomBoutique) {
              this.showToast('Le nom de la boutique est obligatoire.', 'warning');
              return false;
            }
            
            const payload = {
              nom: data.nomBoutique,
              categorie: data.categorieShop || 'Général',
              merchantTrackingId: this.merchantProfile.trackingId
            };

            this.merchantService.updateBoutique(bout.trackingId, payload).subscribe({
              next: () => {
                this.showToast('Boutique modifiée avec succès !', 'success');
                this.loadProfileData(); // Reload list
              },
              error: () => {
                this.showToast('Erreur lors de la modification.', 'danger');
              }
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async initialiserPosition() {
    if (!this.selectedBoutiqueId) return;
    this.isLocating = true;

    if (!navigator.geolocation) {
      this.isLocating = false;
      this.showToast('La géolocalisation n\'est pas supportée par ce navigateur.', 'danger');
      return;
    }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.merchantService.getBoutiqueById(this.selectedBoutiqueId!).subscribe(bout => {
            const payload = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };

            this.merchantService.updateBoutique(this.selectedBoutiqueId!, payload).subscribe({
              next: () => {
                this.isLocating = false;
                this.showToast('Position GPS initialisée avec succès !', 'success');
                this.loadProfileData();
              },
              error: () => {
                this.isLocating = false;
                this.showToast('Erreur lors de la sauvegarde de la position.', 'danger');
              }
            });
          });
        },
      (error) => {
        this.isLocating = false;
        this.showToast('Impossible d\'obtenir la position GPS. Veuillez autoriser l\'accès.', 'danger');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
