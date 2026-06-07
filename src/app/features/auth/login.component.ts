import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-content class="ion-padding flex items-center justify-center">
      <div class="max-w-sm w-full">
        <h1 class="text-2xl font-bold text-center mb-6">Connexion</h1>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" [(ngModel)]="credentials.email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Mot de passe</ion-label>
          <ion-input type="password" [(ngModel)]="credentials.password"></ion-input>
        </ion-item>
        <ion-button expand="block" class="mt-6" (click)="onLogin()" [disabled]="isLoading">
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </ion-button>
        <p *ngIf="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </div>
    </ion-content>
  `
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Redirection basée sur le rôle retourné par le backend
        if (res.role === 'ETUDIANT') {
          this.router.navigate(['/student']);
        } else if (res.role === 'COMMERCANT') {
          this.router.navigate(['/merchant']);
        } else {
          this.errorMessage = 'Rôle non autorisé sur mobile.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Identifiants invalides';
      }
    });
  }
}
