import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline, refreshOutline, logOutOutline, schoolOutline, closeCircleOutline, checkmarkCircleOutline, arrowForwardOutline } from 'ionicons/icons';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-eligibility',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="premium-dark-bg">
      <div class="content-wrapper">
        <div class="eligibility-card" [class.rejected]="eligibilityStatus === 'REJECTED'" [class.approved]="eligibilityStatus === 'APPROVED'">
          
          <!-- ÉTAT 1 : ATTENTE / INITIAL -->
          <ng-container *ngIf="eligibilityStatus === 'PENDING'">
            <div class="icon-circle">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
            </div>
            <h1>Vérification d'Éligibilité</h1>
            <p>Votre dossier scolaire a été reçu. Nous devons maintenant vérifier votre éligibilité à la bourse auprès des services universitaires.</p>
            
            <div class="status-box" *ngIf="currentInscription">
              <ion-icon name="school-outline"></ion-icon>
              <span>Niveau : {{ currentInscription.niveau?.replace('_ANNEE', '') }}</span>
            </div>

            <ion-button expand="block" class="verify-btn" (click)="checkEligibility()" [disabled]="isLoading">
              <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
              <span *ngIf="!isLoading">
                <ion-icon name="refresh-outline" slot="start"></ion-icon>
                Lancer la vérification
              </span>
            </ion-button>
          </ng-container>

          <!-- ÉTAT 2 : ÉLIGIBLE (SUCCÈS) -->
          <ng-container *ngIf="eligibilityStatus === 'APPROVED'">
            <div class="icon-circle success">
              <ion-icon name="checkmark-circle-outline"></ion-icon>
            </div>
            <h1>Vérification réussie !</h1>
            <p class="success-text">Félicitations ! Vous êtes éligible à la bourse pour cette année académique. Votre portefeuille StudCash est activé.</p>
            
            <div class="info-box success">
              <ion-spinner name="dots" style="margin-right: 10px;"></ion-spinner>
              <p>Redirection vers votre Wallet...</p>
            </div>
          </ng-container>

          <!-- ÉTAT 3 : NON ÉLIGIBLE (REJET) -->
          <ng-container *ngIf="eligibilityStatus === 'REJECTED'">
            <div class="icon-circle error">
              <ion-icon name="close-circle-outline"></ion-icon>
            </div>
            <h1>Non Éligible</h1>
            <p class="error-text">Désolé, vous n'êtes pas éligible à l'aide GNS pour l'année scolaire en cours. L'accès au portefeuille est réservé aux boursiers validés.</p>
            
            <div class="info-box error">
              <p>Veuillez vous rapprocher du service scolarité de votre université si vous pensez qu'il s'agit d'une erreur.</p>
            </div>
          </ng-container>

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
    }
    .content-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .eligibility-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 32px;
      padding: 40px 24px;
      text-align: center;
      width: 100%;
      max-width: 400px;
      animation: fadeInUp 0.6s ease-out;
      transition: all 0.4s ease;
    }
    .eligibility-card.rejected { border-color: rgba(239, 68, 68, 0.3); }
    .eligibility-card.approved { border-color: rgba(16, 185, 129, 0.3); }

    .icon-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
    }
    .icon-circle.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }
    .icon-circle.error {
      background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
      box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
    }
    ion-icon { font-size: 40px; color: var(--ion-text-color, white); }
    h1 { color: var(--ion-text-color, white); font-size: 24px; font-weight: 800; margin-bottom: 16px; }
    p { color: var(--ion-text-color-step-150, #94a3b8); font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
    .success-text { color: #34d399; }
    .error-text { color: #f87171; }

    .status-box, .info-box {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 32px;
      color: #cbd5e1;
      font-weight: 600;
    }
    .info-box.success { background: rgba(16, 185, 129, 0.1); color: #6ee7b7; font-size: 13px; font-weight: 400; }
    .info-box.error { background: rgba(239, 68, 68, 0.1); color: #fca5a5; font-size: 13px; font-weight: 400; }

    .verify-btn, .continue-btn {
      --border-radius: 16px;
      font-weight: 700;
      height: 58px;
      margin-bottom: 12px;
    }
    .verify-btn {
      --background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      --box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    }
    .continue-btn {
      --background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      --box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
    }
    .retry-btn { margin-bottom: 12px; --border-radius: 16px; }
    .logout-btn { --color: var(--ion-text-color-step-150, #94a3b8); font-weight: 600; margin-top: 10px; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class EligibilityComponent implements OnInit {
  isLoading = false;
  currentInscription: any = null;
  eligibilityStatus: 'PENDING' | 'REJECTED' | 'APPROVED' = 'PENDING';

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    addIcons({ shieldCheckmarkOutline, refreshOutline, logOutOutline, schoolOutline, closeCircleOutline, checkmarkCircleOutline, arrowForwardOutline });
  }

  ngOnInit() {
    this.loadInscription();
  }

  loadInscription() {
    const studentId = this.authService.getCurrentUserId();
    this.studentService.getActiveYear().subscribe(year => {
      if (studentId && year.libelle) {
        this.studentService.getInscriptionByYear(studentId, year.libelle).subscribe({
          next: (ins) => {
            this.currentInscription = ins;
            if (ins.estInscritDefinitif) {
              this.eligibilityStatus = ins.estEligibleBourse ? 'APPROVED' : 'REJECTED';
              if (this.eligibilityStatus === 'APPROVED') {
                setTimeout(() => this.navCtrl.navigateRoot('/student/wallet'), 2000);
              }
            }
          },
          error: () => this.eligibilityStatus = 'PENDING'
        });
      }
    });
  }

  checkEligibility() {
    if (!this.currentInscription) return;
    
    this.isLoading = true;
    this.studentService.synchronizeInscription(this.currentInscription.trackingId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.estEligibleBourse) {
          this.eligibilityStatus = 'APPROVED';
          setTimeout(() => this.navCtrl.navigateRoot('/student/wallet'), 2000);
        } else {
          this.eligibilityStatus = 'REJECTED';
        }
      },
      error: async () => {
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: "Erreur lors de la communication avec l'université.",
          duration: 3000, color: 'danger', position: 'top'
        });
        toast.present();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }
}
