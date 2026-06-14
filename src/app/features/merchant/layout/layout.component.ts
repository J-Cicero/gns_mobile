import { Component } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { gridOutline, scanOutline, listOutline, timeOutline, personOutline, storefrontOutline, cashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-merchant-layout',
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel, RouterModule],
  template: `
    <div class="layout-container">
      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
      <ion-tab-bar class="premium-tab-bar">
        
        <ion-tab-button routerLink="/merchant/dashboard" routerLinkActive="tab-selected">
          <ion-icon name="grid-outline"></ion-icon>
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/merchant/catalogue" routerLinkActive="tab-selected">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Catalogue</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/merchant/caisse" routerLinkActive="tab-selected" class="scan-tab-button">
          <div class="scan-fab">
            <ion-icon name="scan-outline"></ion-icon>
          </div>
          <ion-label>Encaisser</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/merchant/finance" routerLinkActive="tab-selected">
          <ion-icon name="cash-outline"></ion-icon>
          <ion-label>Finance</ion-label>
        </ion-tab-button>

        <ion-tab-button routerLink="/merchant/profile" routerLinkActive="tab-selected">
          <ion-icon name="storefront-outline"></ion-icon>
          <ion-label>Boutique</ion-label>
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
      --color-selected: #10b981; /* Emeraude pour Boutique */
      transition: all 0.3s ease;
    }

    ion-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    ion-label {
      font-size: 11px;
      font-weight: 600;
    }

    .scan-tab-button {
      position: relative;
      overflow: visible;
    }

    .scan-fab {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      width: 56px;
      height: 56px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -35px;
      box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
      border: 3px solid rgba(255, 255, 255, 0.1);
      
      ion-icon {
        color: var(--ion-text-color, white);
        font-size: 28px;
        margin-bottom: 0;
      }
    }

    ion-tab-button.tab-selected .scan-fab {
      transform: scale(1.1);
      box-shadow: 0 15px 25px rgba(59, 130, 246, 0.6);
    }
  `]
})
export class MerchantLayoutComponent {
  constructor() {
    addIcons({ gridOutline, scanOutline, listOutline, timeOutline, personOutline, storefrontOutline });
  }
}
