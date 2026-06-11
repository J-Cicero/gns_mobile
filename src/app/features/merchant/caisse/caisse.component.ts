import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, qrCodeOutline, cashOutline, backspaceOutline } from 'ionicons/icons';

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent {
  montantSaisi = '0';
  isGenerating = false;

  constructor() {
    addIcons({ arrowBackOutline, qrCodeOutline, cashOutline, backspaceOutline });
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

  genererQR() {
    this.isGenerating = true;
    setTimeout(() => {
      this.isGenerating = false;
      // Ici, on pourrait ouvrir une modal avec le QR code généré
      alert('QR Code généré pour : ' + this.montantSaisi + ' FCFA');
    }, 1000);
  }
}