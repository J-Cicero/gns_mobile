import { Component } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { gridOutline, walletOutline, qrCodeOutline, timeOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel, RouterModule],
  template: `
    <div class="layout-container">
      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
      <ion-tab-bar class="premium-tab-bar">

        <ion-tab-button routerLink="/student/wallet" routerLinkActive="tab-selected">
          <ion-icon name="wallet-outline"></ion-icon>
          <ion-label>Wallet</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/student/qr-code" routerLinkActive="tab-selected" class="qr-tab-button">
          <div class="qr-fab">
            <ion-icon name="qr-code-outline"></ion-icon>
          </div>
          <ion-label>Payer</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/student/history" routerLinkActive="tab-selected">
          <ion-icon name="time-outline"></ion-icon>
          <ion-label>Activités</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/student/profile" routerLinkActive="tab-selected">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Moi</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
    }
    .content-container {
      flex: 1;
      position: relative;
    }
    .premium-tab-bar {
      --background: var(--ion-item-background, var(--ion-item-background, #1e293b));
      --border-color: rgba(150, 150, 150, 0.1);
      height: 80px;
      border-radius: 24px 24px 0 0;
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    ion-tab-button {
      --color: var(--ion-text-color-step-150, #94a3b8);
      --color-selected: #a855f7; /* Vibrant Purple pour l'onglet actif */
      transition: all 0.3s ease;
    }

    ion-tab-button.tab-selected {
      background: rgba(168, 85, 247, 0.1); /* Fond léger pour l'onglet sélectionné */
      border-radius: 12px;
      margin: 4px;
    }

    ion-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    ion-label {
      font-size: 11px;
      font-weight: 600;
    }

    .qr-tab-button {
      position: relative;
      overflow: visible;
    }

    .qr-fab {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      width: 56px;
      height: 56px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -35px;
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
      border: 4px solid var(--ion-background-color, var(--ion-background-color, #0f172a));
      
      ion-icon {
        color: var(--ion-text-color, white);
        font-size: 28px;
        margin-bottom: 0;
      }
    }

    ion-tab-button.tab-selected .qr-fab {
      transform: scale(1.1);
      box-shadow: 0 15px 25px rgba(99, 102, 241, 0.6);
    }
  `]
})
export class StudentLayoutComponent {
  constructor() {
    addIcons({ gridOutline, walletOutline, qrCodeOutline, timeOutline, personOutline });
  }
}
