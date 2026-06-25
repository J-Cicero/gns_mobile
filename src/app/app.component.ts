import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
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
    CommonModule, IonApp, IonRouterOutlet
  ],
})
export class AppComponent {
  public studentPages = [
    { title: 'Dashboard', url: '/main/dashboard', icon: 'home' },
    { title: 'Boutiques', url: '/main/boutiques', icon: 'wallet' },
    { title: 'Historique', url: '/main/history', icon: 'document-text' },
    { title: 'Mon Profil', url: '/main/profile', icon: 'person' },
  ];

  public merchantPages: any[] = [
    // Le menu latéral pour le marchand est désormais vide de raccourcis,
    // car toute la navigation se fait via les onglets du bas (Bottom Tabs).
  ];

  public userRole: string | null = null;
  public showMenu = false;
  
  public themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    
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
    const isPublic = url.includes('/login') || url.includes('/register') || url.includes('/onboarding');
    if (isPublic) {
      this.showMenu = false;
      this.userRole = null;
    } else {
      this.showMenu = true;
      // Detect role from stored profile or URL
      const profileStr = localStorage.getItem('student_profile');
      if (profileStr) {
        this.userRole = 'ETUDIANT';
      } else if (url.includes('/merchant')) {
        this.userRole = 'COMMERCANT';
      } else {
        this.userRole = 'ETUDIANT'; // default for /main/
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
