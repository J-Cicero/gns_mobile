import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, timeOutline, cashOutline, arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { MerchantService } from '../../../core/services/merchant.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class FinanceComponent implements OnInit, OnDestroy {
  currentTab = 'ventes';

  transactions: any[] = [];
  payouts: any[] = []; // Les futures liquidations
  isLoadingSales = false;
  isSubmitting = false;
  errorMessage = '';
  
  liquidationAmount: number | null = null;
  compteBancaireId = ''; // Dans un cas réel, sélectionné via une liste

  private sub: Subscription | null = null;
  private boutiqueId: string | null = null;
  private merchantId: string | null = null;
  private walletId: string | null = null;

  constructor(private merchantService: MerchantService, private toastCtrl: ToastController) {
    addIcons({ checkmarkCircle, timeOutline, cashOutline, arrowDownOutline, arrowUpOutline });
  }

  ngOnInit() {
    const profileStr = localStorage.getItem('merchant_profile');
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      this.merchantId = profile.trackingId;
      this.walletId = profile.walletTrackingId;
    }

    this.sub = this.merchantService.selectedBoutiqueId$.subscribe(id => {
      this.boutiqueId = id;
      if (this.boutiqueId) {
        this.loadSalesHistory();
      } else {
        this.transactions = [];
      }
    });
  }

  loadSalesHistory() {
    if (!this.boutiqueId) return;
    this.isLoadingSales = true;
    this.merchantService.getSalesHistory(this.boutiqueId).subscribe({
      next: (res) => {
        this.transactions = res.content || [];
        this.isLoadingSales = false;
      },
      error: () => {
        this.isLoadingSales = false;
      }
    });
  }

  segmentChanged(event: any) {
    this.currentTab = event.detail.value;
  }

  async requestLiquidation() {
    if (!this.liquidationAmount || this.liquidationAmount <= 0) {
      this.showToast("Saisissez un montant valide.");
      return;
    }
    if (!this.compteBancaireId) {
      this.showToast("Saisissez un ID de compte bancaire valide.");
      return;
    }
    if (!this.merchantId || !this.walletId) {
      this.showToast("Informations du marchand incomplètes.");
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      merchantTrackingId: this.merchantId,
      walletTrackingId: this.walletId,
      montant: this.liquidationAmount,
      compteBancaireTrackingId: this.compteBancaireId,
      motif: "Demande de liquidation mobile"
    };

    this.merchantService.requestLiquidation(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.showToast("Demande de liquidation envoyée avec succès !", "success");
        this.liquidationAmount = null;
        this.compteBancaireId = '';
        // Optionnel : recharger la liste des payouts si endpoint disponible
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showToast(err.error?.message || "Erreur lors de la demande de liquidation.", "danger");
      }
    });
  }

  async showToast(message: string, color: string = 'warning') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
