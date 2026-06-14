import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  schoolOutline, 
  cartOutline, 
  cafeOutline, 
  arrowUpOutline, 
  arrowDownOutline,
  cashOutline,
  walletOutline,
  timeOutline
} from 'ionicons/icons';
import { forkJoin } from 'rxjs';
import { StudentWalletService } from '../../../core/services/student-wallet.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-history',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  isLoading = true;

  constructor(
    private walletService: StudentWalletService,
    private authService: AuthService
  ) {
    addIcons({ arrowBackOutline, schoolOutline, cartOutline, cafeOutline, arrowUpOutline, arrowDownOutline, cashOutline, walletOutline, timeOutline });
  }

  ngOnInit() {
    this.loadRealTransactions();
  }

  loadRealTransactions() {
    const studentId = this.authService.getCurrentUserId();
    if (!studentId) return;

    this.isLoading = true;
    this.walletService.getStudentWallet(studentId).subscribe({
      next: (student) => {
        const walletId = student.walletTrackingId;
        if (walletId) {
          forkJoin([
            this.walletService.getStudentTransactions(studentId),
            this.walletService.getStudentVersements(walletId)
          ]).subscribe({
            next: ([txRes, versementRes]: [any, any]) => {
              const txList = (txRes.content || []).map((t: any) => ({
                id: t.id,
                libelle: 'Paiement : ' + t.boutiqueName,
                categorie: 'ACHAT',
                date: new Date(t.date),
                montantDebite: t.montantDebite,
                montantCredite: 0,
                type: 'DEBIT'
              }));

              const versementList = (versementRes.content || []).map((v: any) => ({
                id: v.id,
                libelle: 'Versement : ' + (v.libelle || 'Bourse'),
                categorie: 'BOURSE',
                date: new Date(v.createdAt),
                montantDebite: 0,
                montantCredite: v.montantVerse,
                type: 'CREDIT'
              }));

              this.transactions = [...txList, ...versementList].sort((a, b) => 
                b.date.getTime() - a.date.getTime()
              );
              this.isLoading = false;
            },
            error: () => this.isLoading = false
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => this.isLoading = false
    });
  }
}