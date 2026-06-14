import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trendingUpOutline, walletOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { MerchantService } from '../../../core/services/merchant.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DashboardComponent implements OnInit {
  quotaInitial = 0;
  quotaRestant = 0;
  ventesJour = 0;
  isLoading = false;

  get pourcentageUtilise() {
    if (this.quotaInitial === 0) return 0;
    return ((this.quotaInitial - this.quotaRestant) / this.quotaInitial) * 100;
  }

  constructor(
    private merchantService: MerchantService,
    private authService: AuthService
  ) {
    addIcons({ trendingUpOutline, walletOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.loadBoutiqueData();
  }

  loadBoutiqueData() {
    const merchantId = this.authService.getCurrentUserId();
    if (!merchantId) return;

    this.isLoading = true;
    this.merchantService.getBoutiqueByMerchant(merchantId).subscribe({
      next: (res) => {
        // Le backend renvoie une page ou un objet unique selon l'implémentation
        const boutique = Array.isArray(res.content) ? res.content[0] : res;
        if (boutique) {
          this.quotaInitial = boutique.plafond || 0;
          this.quotaRestant = boutique.solde || 0;
          // Note: Pour les ventes du jour, il faudrait un endpoint dédié ou calculer côté front
          this.ventesJour = 0; 
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  handleRefresh(event: any) {
    const merchantId = this.authService.getCurrentUserId();
    if (!merchantId) {
      event.target.complete();
      return;
    }

    this.merchantService.getBoutiqueByMerchant(merchantId).subscribe({
      next: (res) => {
        const boutique = Array.isArray(res.content) ? res.content[0] : res;
        if (boutique) {
          this.quotaInitial = boutique.plafond || 0;
          this.quotaRestant = boutique.solde || 0;
          this.ventesJour = 0; 
        }
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }
}