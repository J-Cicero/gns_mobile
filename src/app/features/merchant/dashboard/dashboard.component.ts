import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trendingUpOutline, walletOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DashboardComponent {
  quotaInitial = 1000000;
  quotaUtilise = 350000;
  ventesJour = 45000;

  get quotaRestant() {
    return this.quotaInitial - this.quotaUtilise;
  }

  get pourcentageUtilise() {
    return (this.quotaUtilise / this.quotaInitial) * 100;
  }

  constructor() {
    addIcons({ trendingUpOutline, walletOutline, checkmarkCircleOutline });
  }
}