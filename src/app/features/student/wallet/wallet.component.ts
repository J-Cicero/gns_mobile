import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { walletOutline, arrowUpOutline, arrowDownOutline, timeOutline, qrCodeOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { StudentWalletService } from '../../../core/services/student-wallet.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentProfile } from '../../../core/models/student.model'; // Import StudentProfile
import { TransactionResponse } from '../../../core/models/transaction.model'; // Import TransactionResponse
import { VersementResponse } from '../../../core/models/versement.model'; // Import VersementResponse
import { Page } from '../../../core/models/page.model'; // Import Page

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
        this.balance = student.balance || 0;
        const walletId = student.walletTrackingId;

        // 2. Charger parallèlement Transactions et Versements
        if (walletId) {
          forkJoin([
            this.walletService.getStudentTransactions(studentId),
            this.walletService.getStudentVersements(walletId)
          ]).subscribe({
            next: ([txResPage, versementResPage]: [Page<TransactionResponse>, Page<VersementResponse>]) => { // Typed responses
              const txList = (txResPage.content || []).map((t: TransactionResponse) => ({
                type: 'DEBIT',
                amount: t.amountDebited, // Changed from montantDebite
                date: new Date(t.createdAt), // Changed from date to createdAt
                description: 'Paiement : ' + t.receiverName // Changed from boutiqueName to receiverName
              }));

              const versementList = (versementResPage.content || []).map((v: VersementResponse) => ({
                type: 'CREDIT',
                amount: v.amount, // Changed from montantVerse
                date: new Date(v.paymentDate), // Changed from createdAt to paymentDate
                description: 'Versement GNS : ' + (v.paymentType || 'Bourse') // Changed from libelle to paymentType
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
        this.balance = student.balance || 0;
        const walletId = student.walletTrackingId;

        if (walletId) {
          forkJoin([
            this.walletService.getStudentTransactions(studentId),
            this.walletService.getStudentVersements(walletId)
          ]).subscribe({
            next: ([txResPage, versementResPage]: [Page<TransactionResponse>, Page<VersementResponse>]) => { // Typed responses
              const txList = (txResPage.content || []).map((t: TransactionResponse) => ({
                type: 'DEBIT',
                amount: t.amountDebited,
                date: new Date(t.createdAt),
                description: 'Paiement : ' + t.receiverName
              }));

              const versementList = (versementResPage.content || []).map((v: VersementResponse) => ({
                type: 'CREDIT',
                amount: v.amount,
                date: new Date(v.paymentDate),
                description: 'Versement GNS : ' + (v.paymentType || 'Bourse')
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
