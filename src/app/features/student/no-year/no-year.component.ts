import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, refreshOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-no-year',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="premium-dark-bg">
      <div class="content-wrapper">
        <div class="announcement-card">
          <div class="icon-circle">
            <ion-icon name="calendar-outline"></ion-icon>
          </div>
          <h1>Session Fermée</h1>
          <p>Le système GNS est actuellement en attente de l'ouverture de la nouvelle année académique.</p>
          <div class="info-box">
            <p>Les inscriptions et l'accès au portefeuille seront disponibles dès que l'administration aura lancé la session.</p>
          </div>
          
          <ion-button expand="block" class="refresh-btn" (click)="checkAgain()">
            <ion-icon name="refresh-outline" slot="start"></ion-icon>
            Vérifier à nouveau
          </ion-button>

          <ion-button fill="clear" class="logout-btn" (click)="logout()">
            <ion-icon name="log-out-outline" slot="start"></ion-icon>
            Se déconnecter
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .premium-dark-bg {
      --background: var(--ion-background-color, #0f172a);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .content-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .announcement-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      padding: 40px 24px;
      text-align: center;
      width: 100%;
      max-width: 400px;
      animation: fadeInUp 0.6s ease-out;
    }
    .icon-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
    }
    ion-icon {
      font-size: 40px;
      color: var(--ion-text-color, white);
    }
    h1 {
      color: var(--ion-text-color, white);
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 16px;
    }
    p {
      color: var(--ion-text-color-step-150, #94a3b8);
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .info-box {
      background: rgba(99, 102, 241, 0.1);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 32px;
    }
    .info-box p {
      margin-bottom: 0;
      font-size: 14px;
      color: #818cf8;
      font-weight: 500;
    }
    .refresh-btn {
      --background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      --border-radius: 16px;
      --box-shadow: 0 10px 15px rgba(99, 102, 241, 0.2);
      font-weight: 700;
      height: 56px;
      margin-bottom: 12px;
    }
    .logout-btn {
      --color: var(--ion-text-color-step-150, #94a3b8);
      font-weight: 600;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NoYearComponent {
  constructor(private navCtrl: NavController, private authService: AuthService) {
    addIcons({ calendarOutline, refreshOutline, logOutOutline });
  }

  checkAgain() {
    // On force un rechargement de la route pour redéclencher le guard
    window.location.reload();
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }
}
