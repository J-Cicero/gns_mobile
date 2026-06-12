import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, documentTextOutline, timeOutline, personOutline, addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <ion-tab-button tab="dashboard" href="/student/dashboard">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="scolarite" href="/student/scolarite">
          <ion-icon name="document-text-outline"></ion-icon>
          <ion-label>Scolarité</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="reinscription" href="/student/reinscription">
          <ion-icon name="add-circle-outline"></ion-icon>
          <ion-label>Réinscrire</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="history" href="/student/history">
          <ion-icon name="time-outline"></ion-icon>
          <ion-label>Historique</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/student/profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class StudentLayoutComponent {
  constructor() {
    addIcons({ homeOutline, documentTextOutline, timeOutline, personOutline, addCircleOutline });
  }
}
