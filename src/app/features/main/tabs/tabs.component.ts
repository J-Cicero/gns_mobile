import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, mapOutline, timeOutline, personOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar 
        slot="bottom" 
        class="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">

        <ion-tab-button tab="dashboard" class="text-slate-500 dark:text-slate-400">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label class="text-xs font-medium">Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="history" class="text-slate-500 dark:text-slate-400">
          <ion-icon name="time-outline"></ion-icon>
          <ion-label class="text-xs font-medium">Historique</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="qr" class="bg-indigo-600 dark:bg-indigo-500 rounded-full w-14 h-14 -mt-6 mx-2 text-white shadow-lg flex items-center justify-center">
          <ion-icon name="qr-code-outline" class="text-2xl"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="boutiques" class="text-slate-500 dark:text-slate-400">
          <ion-icon name="map-outline"></ion-icon>
          <ion-label class="text-xs font-medium">Boutiques</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" class="text-slate-500 dark:text-slate-400">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label class="text-xs font-medium">Profil</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: transparent;
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
      height: calc(60px + env(safe-area-inset-bottom));
      min-height: calc(56px + env(safe-area-inset-bottom));
      box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
      width: 100%;
    }
    ion-tab-button {
      --color-selected: #4f46e5;
      flex: 1;
      min-width: 0;
      max-width: none;
    }
  `],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      homeOutline,
      mapOutline,
      timeOutline,
      personOutline,
      qrCodeOutline
    });
  }
}