import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-account-type-selection',
  templateUrl: './account-type-selection.component.html',
  styleUrls: ['./account-type-selection.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AccountTypeSelectionComponent implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  goToStudentRegistration() {
    this.navCtrl.navigateRoot('/onboarding/registration');
  }


}
