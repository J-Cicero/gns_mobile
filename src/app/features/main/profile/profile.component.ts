import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StudentProfile } from '../../../core/models/student.model';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ProfileComponent implements OnInit, ViewWillEnter {

  profile: StudentProfile | null = null;
  isDarkMode = false;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService
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
    } else {
      this.router.navigate(['/auth/login']);
    }
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
