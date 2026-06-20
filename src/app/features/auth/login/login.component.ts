import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, flash, arrowForward, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private navCtrl: NavController) {
    // Enregistrement des icônes pour Angular / Ionic moderne
    addIcons({ personOutline, lockClosedOutline, flash, arrowForward, alertCircle });
  }

  goToRegister() {
    this.navCtrl.navigateRoot('/onboarding/registration');
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login({
      email: this.credentials.email,
      password: this.credentials.password
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.roles === 'ETUDIANT') {
          this.authService.evaluateStudentOnboardingState().subscribe(route => {
            this.router.navigateByUrl(route);
          });
        } else if (res.roles === 'COMMERCANT') {
          this.router.navigate(['/merchant']);
        } else {
          this.errorMessage = 'Rôle non autorisé sur mobile.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
      }
    });
  }
}