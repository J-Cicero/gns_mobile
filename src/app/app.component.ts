import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, 
  IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, homeSharp, walletOutline, walletSharp, documentTextOutline, documentTextSharp,
  personOutline, personSharp, logOutOutline, logOutSharp, moonOutline, moonSharp,
  qrCodeOutline, qrCodeSharp, cashOutline, cashSharp, flash
} from 'ionicons/icons';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, 
    IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonToggle
  ],
})
export class AppComponent {
  public studentPages = [
    { title: 'Mon Wallet', url: '/student/wallet', icon: 'wallet' },
    { title: 'Mes Documents', url: '/student/documents', icon: 'document-text' },
    { title: 'Mon Profil', url: '/student/profile', icon: 'person' },
  ];

  public merchantPages = [
    { title: 'Dashboard', url: '/merchant/dashboard', icon: 'home' },
    { title: 'Mon QR Code', url: '/merchant/qr', icon: 'qr-code' },
    { title: 'Transactions', url: '/merchant/transactions', icon: 'cash' },
  ];

  public userRole: string | null = null;
  public showMenu = false;
  
  public themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Force Dark Mode globally
    document.body.classList.add('dark');
    
    addIcons({ 
      homeOutline, homeSharp, walletOutline, walletSharp, documentTextOutline, documentTextSharp,
      personOutline, personSharp, logOutOutline, logOutSharp, moonOutline, moonSharp,
      qrCodeOutline, qrCodeSharp, cashOutline, cashSharp, flash
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMenuVisibility(event.urlAfterRedirects);
      }
    });
  }

  updateMenuVisibility(url: string) {
    if (url.includes('/login') || url.includes('/register') || url.includes('/waiting') || url.includes('/documents')) {
      this.showMenu = false;
    } else {
      this.showMenu = true;
      if (url.includes('/student')) {
        this.userRole = 'ETUDIANT';
      } else if (url.includes('/merchant')) {
        this.userRole = 'COMMERCANT';
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
