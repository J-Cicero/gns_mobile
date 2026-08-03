import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, ToastController, ViewWillEnter
 } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { StudentProfile } from '../../../core/models/student.model';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { CardService } from '../../../core/services/card.service';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonContent, QRCodeComponent
  ]
})
export class ProfileComponent implements OnInit, ViewWillEnter {

  profile: StudentProfile | null = null;
  card: any = null;
  isLoadingCard = false;
  cardErrorMessage = '';
  isDarkMode = false;

  cardStatusLabel: string = '';
  cardStatusSteps: { label: string; done: boolean; active: boolean }[] = [];

  cardPrice: number = 4000;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private cardService: CardService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDark;
    this.loadCardPrice();
  }

  loadCardPrice() {
    this.cardService.getCardPrice().subscribe({
      next: (price) => this.cardPrice = price || 4000,
      error: () => this.cardPrice = 4000
    });
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  loadProfile() {
    const profileStr = localStorage.getItem('student_profile');
    if (profileStr) {
      this.profile = JSON.parse(profileStr);
      this.loadCard();
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  loadCard() {
    if (!this.profile) return;
    this.isLoadingCard = true;
    this.cardErrorMessage = '';
    this.cardService.getStudentStudenttrackingid(this.profile.trackingId).subscribe({
      next: (res: any) => {
        const cardsList = res?.content || (Array.isArray(res) ? res : []);
        if (cardsList.length > 0) {
          this.card = cardsList[0];
          this.buildCardStatus();
        } else {
          this.card = null;
          this.cardStatusSteps = [];
        }
        this.isLoadingCard = false;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.card = null;
        } else {
          this.cardErrorMessage = "Impossible de charger la carte.";
        }
        this.isLoadingCard = false;
      }
    });
  }

  // ✅ Construction des étapes du statut de la carte
  buildCardStatus() {
    if (!this.card) return;
    const status = this.card.statutCarte;

    const steps = [
      { key: 'EN_ATTENTE', label: 'Demande reçue' },
      { key: 'PRETE', label: 'Carte prête' },
      { key: 'ACTIVE', label: 'Carte activée' },
    ];

    const statusIndex = steps.findIndex(s => s.key === status);
    this.cardStatusLabel = this.getCardStatusLabel(status);
    this.cardStatusSteps = steps.map((s, i) => ({
      label: s.label,
      done: i < statusIndex,
      active: i === statusIndex
    }));
  }

  getCardStatusLabel(status: string): string {
    switch (status) {
      case 'EN_ATTENTE': return 'Demande en cours de traitement';
      case 'PRETE': return 'Votre carte est prête à être récupérée';
      case 'ACTIVE': return 'Carte active et opérationnelle';
      case 'BLOQUEE': return 'Carte bloquée — Contactez le support';
      case 'PERDUE': return 'Carte déclarée perdue';
      default: return status;
    }
  }

  requestCard() {
    if (!this.profile) return;
    this.isLoadingCard = true;
    this.cardErrorMessage = '';
    this.cardService.demanderCarte(this.profile.trackingId).subscribe({
      next: async (res: any) => {
        this.loadCard();
        await this.showToast('✅ Demande de carte envoyée ! Les frais ont été débités.', 'success');
      },
      error: async (err: any) => {
        this.isLoadingCard = false;
        // ✅ Gérer le cas où la carte existe déjà
        const errMsg: string = err.error?.message || err.message || '';
        if (err.status === 409 || errMsg.toLowerCase().includes('déjà') || errMsg.toLowerCase().includes('already') || errMsg.toLowerCase().includes('existe')) {
          await this.showToast('Vous avez déjà une demande de carte en cours.', 'warning');
          // Recharger pour afficher la carte existante
          this.loadCard();
        } else if (err.status === 402 || errMsg.toLowerCase().includes('solde') || errMsg.toLowerCase().includes('insuffi')) {
          await this.showToast(`❌ Solde insuffisant pour la demande de carte (${this.cardPrice} FCFA requis).`, 'danger');
        } else {
          this.cardErrorMessage = errMsg || "Erreur lors de la demande de carte.";
          await this.showToast(`❌ ${this.cardErrorMessage}`, 'danger');
        }
      }
    });
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3500,
      color,
      position: 'top',
      buttons: [{ icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDark;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
