import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { MerchantService } from '../../../../core/services/merchant.service';
import { MerchantProfile } from '../../../../core/models/merchant.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-merchant-waiting-screen',
  templateUrl: './waiting-screen.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class WaitingScreenComponent implements OnInit, OnDestroy {

  merchantProfile: MerchantProfile | null = null;
  refreshInterval: any;
  isRefreshing = false;

  constructor(
    private router: Router,
    private merchantService: MerchantService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
    // Poll pour vérifier si le statut a changé (toutes les 15s)
    this.refreshInterval = setInterval(() => {
      this.checkStatus();
    }, 15000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadProfile() {
    const profileStr = localStorage.getItem('merchant_profile');
    if (!profileStr) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.merchantProfile = JSON.parse(profileStr);
  }

  checkStatus() {
    if (!this.merchantProfile) return;
    this.isRefreshing = true;
    
    this.merchantService.getMerchantProfile(this.merchantProfile.trackingId).subscribe({
      next: (profile) => {
        this.isRefreshing = false;
        this.merchantProfile = profile;
        localStorage.setItem('merchant_profile', JSON.stringify(profile));
        
        if (profile.kycStatus === 'VALIDATED') {
          // Félicitations, rediriger vers le dashboard
          if (this.refreshInterval) clearInterval(this.refreshInterval);
          this.router.navigate(['/merchant/dashboard']);
        } else if (profile.kycStatus === 'REJECTED') {
          // Gestion du rejet (idéalement rediriger vers upload avec message d'erreur)
          if (this.refreshInterval) clearInterval(this.refreshInterval);
        }
      },
      error: () => {
        this.isRefreshing = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
