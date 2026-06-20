import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { WalletResponse } from '../../../core/models/wallet.model';
import { Page } from '../../../core/models/page.model';
import { TransactionResponse } from '../../../core/models/transaction.model';
import { StudentProfile } from '../../../core/models/student.model';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, QRCodeComponent]
})
export class DashboardComponent implements OnInit, ViewWillEnter {

  wallet: WalletResponse | null = null;
  recentTransactions: TransactionResponse[] = [];
  studentName = '';
  studentTrackingId = '';
  qrCodeData = '';
  isQrModalOpen = false;

  isLoading = true;
  errorMessage = '';

  constructor(private walletService: WalletService) { }

  ngOnInit() {
    // Keep this empty or for very initial setup that doesn't need to re-run
  }

  ionViewWillEnter() { // Ionic lifecycle hook
    this.loadProfile();
    this.loadDashboardData();
  }

  loadProfile() {
    const profileStr = localStorage.getItem('student_profile');
    if (profileStr) {
      const profile: StudentProfile = JSON.parse(profileStr);
      this.studentName = profile.firstName || 'Étudiant'; // Updated field
      this.studentTrackingId = profile.trackingId; // Added for QR Code
      this.qrCodeData = JSON.stringify({ type: 'PAYMENT', senderTrackingId: this.studentTrackingId });
    }
  }

  loadDashboardData() {
    this.isLoading = true;
    this.errorMessage = '';

    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      this.isLoading = false;
      this.errorMessage = "Profil non trouvé. Veuillez vous reconnecter.";
      return;
    }
    const profile: StudentProfile = JSON.parse(profileStr);

    if (!profile.walletTrackingId) {
      // Pas de walletTrackingId en cache : afficher un wallet vide sans bloquer
      this.wallet = { trackingId: '', walletType: 'STUDENT' as any, status: 'INACTIF' as any, fundingLevel: 'NORMAL' as any, balance: 0, limitAmount: 0, currency: 'FCFA', createdAt: '' };
      this.isLoading = false;
      this.loadTransactions(profile.trackingId);
      return;
    }

    this.walletService.getMyWallet(profile.walletTrackingId).subscribe({
      next: (walletResponse) => {
        this.wallet = walletResponse;
        // Force balance to 0 if null/undefined from backend
        if (this.wallet && (this.wallet.balance === null || this.wallet.balance === undefined)) {
          (this.wallet as any).balance = 0;
        }
        this.loadTransactions(profile.trackingId);
      },
      error: () => {
        // En cas d'erreur réseau, afficher un wallet à 0
        this.wallet = { trackingId: profile.walletTrackingId!, walletType: 'STUDENT' as any, status: 'INACTIF' as any, fundingLevel: 'NORMAL' as any, balance: 0, limitAmount: 0, currency: 'FCFA', createdAt: '' };
        this.isLoading = false;
        this.loadTransactions(profile.trackingId);
      }
    });
  }

  loadTransactions(studentTrackingId: string) {
    if (!studentTrackingId) { this.isLoading = false; return; }
    this.walletService.getRecentTransactions(studentTrackingId, 5).subscribe({
      next: (res: Page<TransactionResponse>) => {
        this.recentTransactions = res?.content || [];
        this.isLoading = false;
      },
      error: () => {
        this.recentTransactions = [];
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadDashboardData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
