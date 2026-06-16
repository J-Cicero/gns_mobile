import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { Wallet } from '../../../core/models/wallet.model';
import { Transaction } from '../../../core/models/transaction.model';
import { StudentProfile } from '../../../core/models/student.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class DashboardComponent implements OnInit {

  wallet: Wallet | null = null;
  recentTransactions: Transaction[] = [];
  studentName = '';
  
  isLoading = true;
  errorMessage = '';

  constructor(private walletService: WalletService) { }

  ngOnInit() {
    this.loadProfile();
    this.loadDashboardData();
  }

  loadProfile() {
    const profileStr = localStorage.getItem('student_profile');
    if (profileStr) {
      const profile: StudentProfile = JSON.parse(profileStr);
      this.studentName = profile.prenom || 'Étudiant';
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
      // Si on n'a pas de walletTrackingId, on utilise juste la balance de StudentResponse
      this.wallet = {
        trackingId: 'N/A',
        solde: profile.balance || 0,
        statutWallet: 'ACTIF',
        proprietaireTrackingId: profile.trackingId,
        typeProprietaire: 'ETUDIANT'
      };
      this.loadTransactions(profile.trackingId);
      return;
    }

    this.walletService.getMyWallet(profile.walletTrackingId).subscribe({
      next: (w) => {
        this.wallet = w;
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
      next: (res) => {
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
