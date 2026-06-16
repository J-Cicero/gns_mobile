import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trendingUpOutline, walletOutline, checkmarkCircleOutline, locationOutline, navigateOutline } from 'ionicons/icons';
import { MerchantService } from '../../../core/services/merchant.service';
import { WalletService } from '../../../core/services/wallet.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  quotaInitial = 0;
  quotaRestant = 0;
  ventesJour = 0;
  clientsUniques = 0;
  isLoading = false;
  boutiqueId: string | null = null;
  hasLocation = true;
  isLocating = false;
  private sub: Subscription | null = null;

  get pourcentageUtilise() {
    if (this.quotaInitial === 0) return 0;
    return ((this.quotaInitial - this.quotaRestant) / this.quotaInitial) * 100;
  }

  constructor(
    private merchantService: MerchantService,
    private walletService: WalletService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    addIcons({ trendingUpOutline, walletOutline, checkmarkCircleOutline, locationOutline, navigateOutline });
  }

  ngOnInit() {
    this.sub = this.merchantService.selectedBoutiqueId$.subscribe(id => {
      this.boutiqueId = id;
      if (this.boutiqueId) {
        this.loadBoutiqueData();
      }
    });
  }

  loadBoutiqueData(event?: any) {
    if (!this.boutiqueId) {
      if (event) event.target.complete();
      return;
    }

    this.isLoading = true;
    this.merchantService.getBoutiqueById(this.boutiqueId).subscribe({
      next: (boutique) => {
        if (boutique) {
          this.hasLocation = boutique.latitude != null && boutique.longitude != null;
          
          if (boutique.walletTrackingId) {
            this.walletService.getMyWallet(boutique.walletTrackingId).subscribe({
              next: (wallet) => {
                this.quotaInitial = wallet.plafond || 0;
                this.quotaRestant = wallet.solde || 0;
              }
            });
          }
        }
        
        // Charger l'historique des transactions
        this.walletService.getBoutiqueTransactions(this.boutiqueId!).subscribe({
          next: (res) => {
            const txs = res.content || [];
            this.ventesJour = txs.reduce((acc: number, tx: any) => acc + (tx.amount || 0), 0);
            
            const uniqueStudents = new Set(txs.map((tx: any) => tx.senderTrackingId));
            this.clientsUniques = uniqueStudents.size;

            this.isLoading = false;
            if (event) event.target.complete();
          },
          error: () => {
            this.isLoading = false;
            if (event) event.target.complete();
          }
        });
      },
      error: () => {
        this.isLoading = false;
        if (event) event.target.complete();
      }
    });
  }

  handleRefresh(event: any) {
    this.loadBoutiqueData(event);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
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
}