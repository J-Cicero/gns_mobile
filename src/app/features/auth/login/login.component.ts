import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, flash, arrowForward, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    // Enregistrement des icônes pour Angular / Ionic moderne
    addIcons({ mailOutline, lockClosedOutline, flash, arrowForward, alertCircle });
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
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
        this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
      }
    });
  }
}