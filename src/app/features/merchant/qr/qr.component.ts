import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { qrCodeOutline, shareSocialOutline } from 'ionicons/icons';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class QrComponent {
  trackingId = 'M-GNS-2026-98X7Y';

  constructor() {
    addIcons({ qrCodeOutline, shareSocialOutline });
  }

  shareQR() {
    console.log('Partage du QR Code...');
    // Intégration Capacitor Share à faire ici
  }
}
