import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, scanOutline, cashOutline, backspaceOutline } from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent {
  montantSaisi = '0';
  isScanning = false;

  constructor(private toastCtrl: ToastController) {
    addIcons({ arrowBackOutline, scanOutline, cashOutline, backspaceOutline });
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

  // Ajout de chiffres via le pavé numérique
  ajouterChiffre(chiffre: string) {
    if (this.montantSaisi === '0') this.montantSaisi = chiffre;
    else this.montantSaisi += chiffre;
  }

  supprimerChiffre() {
    if (this.montantSaisi.length > 1) this.montantSaisi = this.montantSaisi.slice(0, -1);
    else this.montantSaisi = '0';
  }

  async scannerEtudiant() {
    this.isScanning = true;
    
    try {
      // Demander la permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // Cacher le fond web pour voir la caméra
        document.body.classList.add('scanner-active');
        BarcodeScanner.hideBackground();

        const result = await BarcodeScanner.startScan();
        
        // Arrêter le scan et restaurer le fond
        document.body.classList.remove('scanner-active');
        BarcodeScanner.showBackground();
        BarcodeScanner.stopScan();

        this.isScanning = false;

        if (result.hasContent) {
          const trackingId = result.content;
          this.showToast('Étudiant scanné : ' + trackingId + ' - Montant : ' + this.montantSaisi + ' FCFA', 'success');
        }
      } else {
        this.isScanning = false;
        this.showToast("Permission de la caméra refusée");
      }
    } catch (e) {
      this.isScanning = false;
      document.body.classList.remove('scanner-active');
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
      this.showToast("Erreur lors du scan: Caméra non disponible");
    }
  }
}