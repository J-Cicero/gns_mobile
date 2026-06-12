import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, scanOutline, listOutline, timeOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-merchant-layout',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
  template: `
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <ion-tab-button tab="dashboard" href="/merchant/dashboard">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="caisse" href="/merchant/caisse">
          <ion-icon name="scan-outline"></ion-icon>
          <ion-label>Caisse</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="catalogue" href="/merchant/catalogue">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Catalogue</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="history" href="/merchant/history">
          <ion-icon name="time-outline"></ion-icon>
          <ion-label>Historique</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/merchant/profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class MerchantLayoutComponent {
  constructor() {
    addIcons({ homeOutline, scanOutline, listOutline, timeOutline, personOutline });
  }
}
