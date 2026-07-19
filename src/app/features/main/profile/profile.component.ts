import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, ViewWillEnter
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

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private cardService: CardService
  ) { }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDark; // Keep initial theme check here
  }

  ionViewWillEnter() { // Ionic lifecycle hook
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
        const cardsList = res?.content || res || [];
        if (cardsList.length > 0) {
          this.card = cardsList[0];
        } else {
          this.card = null;
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

  requestCard() {
    if (!this.profile) return;
    this.isLoadingCard = true;
    this.cardErrorMessage = '';
    this.cardService.demanderCarte(this.profile.trackingId).subscribe({
      next: (res: any) => {
        this.loadCard();
        alert("Demande de carte envoyée avec succès ! Les frais de création ont été débités.");
      },
      error: (err: any) => {
        this.cardErrorMessage = err.error?.message || err.message || "Erreur lors de la demande de carte.";
        this.isLoadingCard = false;
        alert(this.cardErrorMessage);
      }
    });
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
