import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { walletOutline, arrowUpOutline, arrowDownOutline, timeOutline, qrCodeOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { StudentWalletService } from '../../../core/services/student-wallet.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class WalletComponent implements OnInit {
  balance = 0;
  transactions: any[] = [];
  isLoading = false;

  constructor(
    private walletService: StudentWalletService,
    private authService: AuthService
  ) {
    addIcons({ walletOutline, arrowUpOutline, arrowDownOutline, timeOutline, qrCodeOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const studentId = this.authService.getCurrentUserId();
    if (!studentId) return;

    this.isLoading = true;
    
    // 1. Charger les infos de l'étudiant (pour le solde et le walletId)
    this.walletService.getStudentWallet(studentId).subscribe({
      next: (student) => {
        this.balance = student.solde || 0;
        const walletId = student.walletTrackingId;

        // 2. Charger parallèlement Transactions et Versements
        if (walletId) {
          forkJoin([
            this.walletService.getStudentTransactions(studentId),
            this.walletService.getStudentVersements(walletId)
          ]).subscribe({
            next: ([txRes, versementRes]: [any, any]) => {
              const txList = (txRes.content || []).map((t: any) => ({
                type: 'DEBIT',
                amount: t.montantDebite,
                date: new Date(t.date),
                description: 'Paiement : ' + t.boutiqueName
              }));

              const versementList = (versementRes.content || []).map((v: any) => ({
                type: 'CREDIT',
                amount: v.montantVerse,
                date: new Date(v.createdAt),
                description: 'Versement GNS : ' + (v.libelle || 'Bourse')
              }));

              // Fusionner et trier par date décroissante
              this.transactions = [...txList, ...versementList].sort((a, b) => 
                b.date.getTime() - a.date.getTime()
              );
              
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  handleRefresh(event: any) {
    // Recharger les données et notifier le refresher une fois terminé
    const studentId = this.authService.getCurrentUserId();
    if (!studentId) {
      event.target.complete();
      return;
    }

    this.walletService.getStudentWallet(studentId).subscribe({
      next: (student) => {
        this.balance = student.solde || 0;
        const walletId = student.walletTrackingId;

        if (walletId) {
          forkJoin([
            this.walletService.getStudentTransactions(studentId),
            this.walletService.getStudentVersements(walletId)
          ]).subscribe({
            next: ([txRes, versementRes]: [any, any]) => {
              const txList = (txRes.content || []).map((t: any) => ({
                type: 'DEBIT',
                amount: t.montantDebite,
                date: new Date(t.date),
                description: 'Paiement : ' + t.boutiqueName
              }));

              const versementList = (versementRes.content || []).map((v: any) => ({
                type: 'CREDIT',
                amount: v.montantVerse,
                date: new Date(v.createdAt),
                description: 'Versement GNS : ' + (v.libelle || 'Bourse')
              }));

              this.transactions = [...txList, ...versementList].sort((a, b) => 
                b.date.getTime() - a.date.getTime()
              );
              event.target.complete();
            },
            error: () => event.target.complete()
          });
        } else {
          event.target.complete();
        }
      },
      error: () => event.target.complete()
    });
  }
}
