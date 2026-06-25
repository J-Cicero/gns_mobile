import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QRCodeComponent } from 'angularx-qrcode';
import { addIcons } from 'ionicons';
import { qrCodeOutline, refreshOutline, shareSocialOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-qr',
  standalone: true,
  imports: [CommonModule, IonicModule, QRCodeComponent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Mon QR Code de Paiement</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="premium-dark-bg">
      <div class="qr-container fade-in">
        <div class="qr-card">
          <div class="user-info">
            <h2>{{ userName }}</h2>
            <p>Scannez ce code pour encaisser</p>
          </div>

          <div class="qr-wrapper">
            <!-- Vrai QR code avec JSON formaté -->
            <div class="qr-actual" style="display: block; width: 200px; height: 200px;">
              <qrcode [qrdata]="qrPayload" [width]="200" [errorCorrectionLevel]="'M'" elementType="canvas"></qrcode>
            </div>
            <div class="qr-overlay-logo">
              <ion-icon name="flash"></ion-icon>
            </div>
          </div>

          <div class="tracking-id-badge">
            <code>{{ trackingId }}</code>
          </div>

          <p class="expiry-note">Ce code est unique à votre profil boursier.</p>
        </div>

        <div class="actions-grid">
          <ion-button fill="clear" class="action-btn" (click)="refreshQr()">
            <ion-icon name="refresh-outline" slot="icon-only"></ion-icon>
            <ion-label>Actualiser</ion-label>
          </ion-button>
          
          <ion-button fill="clear" class="action-btn">
            <ion-icon name="share-social-outline" slot="icon-only"></ion-icon>
            <ion-label>Partager</ion-label>
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .premium-dark-bg {
      --background: var(--ion-background-color, #0f172a);
    }
    .qr-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .qr-card {
      background: white;
      border-radius: 40px;
      padding: 40px 30px;
      width: 100%;
      max-width: 340px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    .user-info h2 {
      color: var(--ion-background-color, #0f172a);
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .user-info p {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .qr-wrapper {
      position: relative;
      background: #f8fafc;
      border-radius: 24px;
      padding: 20px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-placeholder ion-icon {
      font-size: 200px;
      color: var(--ion-background-color, #0f172a);
    }
    .qr-overlay-logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #6366f1;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid white;
    }
    .qr-overlay-logo ion-icon {
      font-size: 24px;
      color: var(--ion-text-color, white);
    }
    .tracking-id-badge {
      background: #f1f5f9;
      padding: 8px 16px;
      border-radius: 12px;
      margin-bottom: 16px;
      display: inline-block;
    }
    .tracking-id-badge code {
      color: #475569;
      font-weight: 700;
      font-size: 13px;
    }
    .expiry-note {
      color: var(--ion-text-color-step-150, #94a3b8);
      font-size: 12px;
    }
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      max-width: 340px;
      margin-top: 30px;
      gap: 16px;
    }
    .action-btn {
      --color: var(--ion-text-color, white);
      font-size: 12px;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      height: auto;
      
      ion-icon {
        font-size: 24px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.1);
        padding: 12px;
        border-radius: 16px;
      }
    }
  `]
})
export class QrComponent implements OnInit {
  public trackingId: string | null = '';
  public userName: string = 'Chargement...';
  public qrPayload: string = 'GNS-INVALID-QR';
  
  private authService = inject(AuthService);

  constructor() {
    addIcons({ qrCodeOutline, refreshOutline, shareSocialOutline });
  }

  ngOnInit() {
    this.loadQrData();
  }

  ionViewWillEnter() {
    this.loadQrData();
  }

  loadQrData() {
    this.trackingId = this.authService.getCurrentUserId();
    const profile = this.authService.getCurrentProfile();
    if (profile) {
      this.userName = `${profile.firstName} ${profile.lastName}`;
    } else {
      this.userName = "Étudiant GNS"; 
    }

    if (this.trackingId) {
      this.qrPayload = JSON.stringify({ type: "PAYMENT", studentId: this.trackingId });
    }
  }

  refreshQr() {
    // Logique de rafraîchissement si nécessaire
  }
}
