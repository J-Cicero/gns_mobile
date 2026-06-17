import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
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
    private walletService: WalletService,
    private alertCtrl: AlertController
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

  async confirmPayment() {
    const profileStr = localStorage.getItem('student_profile');
    if (!profileStr) {
      alert("Profil introuvable, impossible de payer.");
      return;
    }
    const profile = JSON.parse(profileStr);

    const alert = await this.alertCtrl.create({
      header: 'Confirmation de Paiement',
      message: `Souhaitez-vous payer ${this.scanResult.amount} FCFA à ${this.scanResult.merchantName || 'cette boutique'} ?`,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Entrez votre mot de passe pour autoriser'
        }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Confirmer',
          handler: (data) => {
            if (!data.password) {
              alert.message = 'Mot de passe obligatoire !';
              return false;
            }
            this.executePayment(profile.trackingId, data.password);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  executePayment(senderTrackingId: string, password: string) {
    const payload = {
      senderTrackingId: senderTrackingId,
      receiverTrackingId: this.scanResult.merchantId || this.scanResult.boutiqueTrackingId,
      amount: this.scanResult.amount,
      password: password
    };

    this.walletService.pay(payload).subscribe({
      next: (res) => {
        alert('Paiement confirmé avec succès !');
        this.router.navigate(['/main/dashboard']);
      },
      error: (err) => {
        alert("Échec du paiement : " + (err.error?.message || "Mot de passe incorrect ou solde insuffisant."));
      }
    });
  }

  restartScan() {
    this.scanResult = null;
    this.isScanning = true;
  }
}
