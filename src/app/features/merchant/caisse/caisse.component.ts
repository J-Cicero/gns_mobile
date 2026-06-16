import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, scanOutline, cashOutline, backspaceOutline, checkmarkCircle, lockClosed, arrowForwardOutline, qrCodeOutline, personCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ActivatedRoute } from '@angular/router';
import { MerchantService } from '../../../core/services/merchant.service';
import { StudentService } from '../../../core/services/student.service';
import { Subscription } from 'rxjs';

import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [CommonModule, IonicModule, QRCodeComponent],
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit, OnDestroy {
  montantSaisi = '0';
  step: 'AMOUNT' | 'QR' = 'AMOUNT';
  boutiqueId: string | null = null;
  qrData: string = '';
  
  private sub: Subscription | null = null;

  constructor(
    private toastCtrl: ToastController, 
    private merchantService: MerchantService
  ) {
    addIcons({ arrowBackOutline, backspaceOutline, checkmarkCircle, arrowForwardOutline, qrCodeOutline, closeCircleOutline });
  }

  ngOnInit() {
    this.sub = this.merchantService.selectedBoutiqueId$.subscribe(id => {
      this.boutiqueId = id;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.step === 'QR') return;

    const key = event.key;
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
      this.ajouterChiffre(key);
    } else if (key === 'Backspace') {
      this.supprimerChiffre();
    } else if (key === 'Enter') {
      this.genererQR();
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top',
      cssClass: 'premium-toast'
    });
    toast.present();
  }

  ajouterChiffre(chiffre: string) {
    if (this.step === 'AMOUNT') {
      if (this.montantSaisi === '0') this.montantSaisi = chiffre;
      else this.montantSaisi += chiffre;
    }
  }

  supprimerChiffre() {
    if (this.step === 'AMOUNT') {
      if (this.montantSaisi.length > 1) this.montantSaisi = this.montantSaisi.slice(0, -1);
      else this.montantSaisi = '0';
    }
  }

  genererQR() {
    if (parseInt(this.montantSaisi) <= 0) {
      this.showToast("Saisissez un montant valide.", "warning");
      return;
    }
    
    if (!this.boutiqueId) {
      this.showToast("Aucune boutique sélectionnée.", "warning");
      return;
    }

    // Le QR Code contiendra les informations nécessaires pour que l'étudiant paie
    const qrPayload = {
      merchantId: this.boutiqueId, // ou un identifiant de caisse
      amount: parseInt(this.montantSaisi),
      timestamp: new Date().getTime()
    };
    
    this.qrData = JSON.stringify(qrPayload);
    this.step = 'QR';
  }

  annulerPaiement() {
    this.step = 'AMOUNT';
    this.montantSaisi = '0';
    this.qrData = '';
  }
}
