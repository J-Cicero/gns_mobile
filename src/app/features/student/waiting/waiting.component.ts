import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { timeOutline, logOutOutline, alertCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-waiting',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit {
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ timeOutline, logOutOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'no_active_year') {
        this.isError = true;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
