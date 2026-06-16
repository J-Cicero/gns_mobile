import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ScannerComponent implements OnInit {

  isScanning = true;
  scanResult: any = null;

  manualMerchantId = '';
  manualAmount: number | null = null;

  constructor(
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    // Dans une vraie implémentation, on initialiserait la caméra ici.
  }

  // Traitement de la saisie manuelle (remplace le mock fixe)
  simulateScan() {
    if (!this.manualMerchantId || !this.manualAmount) {
      alert("Veuillez saisir un ID marchand et un montant.");
      return;
    }
    this.isScanning = false;
    this.scanResult = {
      merchantName: 'Boutique (Saisie Manuelle)',
      merchantId: this.manualMerchantId,
      amount: this.manualAmount
    };
  }

  cancelScan() {
    this.router.navigate(['/main/dashboard']);
  }

  confirmPayment() {
    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      alert("Profil introuvable, impossible de payer.");
      return;
    }
    const profile = JSON.parse(profileStr);

    const payload = {
      senderTrackingId: profile.trackingId,
      receiverTrackingId: this.scanResult.merchantId, // Le QR code doit fournir le trackingId de la boutique
      amount: this.scanResult.amount
    };

    // Appel backend
    this.walletService.pay(payload).subscribe({
      next: (res) => {
        alert('Paiement confirmé !');
        this.router.navigate(['/main/dashboard']);
      },
      error: (err) => {
        alert("Erreur lors du paiement : " + (err.error?.message || "Échec"));
      }
    });
  }

  restartScan() {
    this.scanResult = null;
    this.isScanning = true;
  }
}
