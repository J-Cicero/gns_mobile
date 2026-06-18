import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { FormsModule } from '@angular/forms';
import { TransactionRequest } from '../../../core/models/transaction.model'; // Import TransactionRequest

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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Traitement de la saisie manuelle (remplace le mock fixe)
  async simulateScan() { // Made async to use await presentAlert
    if (!this.manualMerchantId || !this.manualAmount) {
      await this.presentAlert("Erreur de saisie", "Veuillez saisir un ID marchand et un montant.");
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
      await this.presentAlert("Erreur de profil", "Profil introuvable, impossible de payer."); // Changed alert to presentAlert
      return;
    }
    const profile = JSON.parse(profileStr);

    const ionAlert = await this.alertCtrl.create({ // Renamed alert to ionAlert
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
          handler: async (data) => { // Made handler async
            if (!data.password) {
              // ionAlert.message = 'Mot de passe obligatoire !'; // Cannot directly modify alert message like this
              await this.presentAlert("Erreur de saisie", "Mot de passe obligatoire !"); // Use new method
              return false; // Prevent alert from closing
            }
            this.executePayment(profile.trackingId, data.password);
            return true;
          }
        }
      ]
    });

    await ionAlert.present(); // Changed alert to ionAlert
  }

  executePayment(senderTrackingId: string, password: string) {
    const request: TransactionRequest = { // Changed payload to request, typed as TransactionRequest
      senderTrackingId: senderTrackingId,
      receiverTrackingId: this.scanResult.merchantId || this.scanResult.boutiqueTrackingId,
      amount: this.scanResult.amount,
      password: password
    };

    this.walletService.pay(request).subscribe({ // Changed payload to request
      next: (res) => {
        this.presentAlert('Succès', 'Paiement confirmé avec succès !'); // Changed alert to presentAlert
        this.router.navigate(['/main/dashboard']);
      },
      error: (err) => {
        this.presentAlert('Erreur', "Échec du paiement : " + (err.error?.message || "Mot de passe incorrect ou solde insuffisant.")); // Changed alert to presentAlert
      }
    });
  }

  restartScan() {
    this.scanResult = null;
    this.isScanning = true;
  }
}
