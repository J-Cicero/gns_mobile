import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { WalletResponse } from '../../../core/models/wallet.model';
import { Page } from '../../../core/models/page.model';
import { TransactionResponse } from '../../../core/models/transaction.model';
import { StudentProfile } from '../../../core/models/student.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class DashboardComponent implements OnInit, ViewWillEnter {

  wallet: WalletResponse | null = null;
  recentTransactions: TransactionResponse[] = [];
  studentName = '';
  
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
      // If no walletTrackingId, it means the student doesn't have a wallet yet or an issue.
      // The UI should reflect this, not construct a partial wallet.
      this.isLoading = false;
      this.errorMessage = "Portefeuille non trouvé pour cet étudiant.";
      return;
    }

    // Since getStudentWallet returns StudentProfile, we need to extract the walletTrackingId
    // and then call getMyWallet with that ID, or ensure getStudentWallet returns WalletResponse
    // Directly calling getMyWallet with walletTrackingId is the most straightforward.
    this.walletService.getMyWallet(profile.walletTrackingId).subscribe({
      next: (walletResponse) => {
        this.wallet = walletResponse;
        this.loadTransactions(profile.trackingId);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Impossible de charger les données du portefeuille.";
      }
    });
  }

  loadTransactions(studentTrackingId: string) {
    this.walletService.getRecentTransactions(studentTrackingId, 5).subscribe({
      next: (res: Page<TransactionResponse>) => { // Updated type
        this.recentTransactions = res.content || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Impossible de charger les transactions.";
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
