import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, schoolOutline, walletOutline, checkmarkCircleOutline, alertCircleOutline, receiptOutline } from 'ionicons/icons';

@Component({
  selector: 'app-scolarite',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './scolarite.component.html',
  styleUrls: ['./scolarite.component.scss']
})
export class ScolariteComponent implements OnInit {
  paymentSuccess = false;
  isLoading = false;
  Math = Math;
  scolariteInfo = {
    isLocked: false,
    anneeAcademique: '2025-2026',
    niveau: 'Licence 2',
    compteDebite: '123456789',
    montant: 25000
  };

  constructor(private router: Router) {
    addIcons({ arrowBackOutline, schoolOutline, walletOutline, checkmarkCircleOutline, alertCircleOutline, receiptOutline });
  }

  ngOnInit() { }

  effectuerPaiement() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.paymentSuccess = true;
    }, 1000);
  }

  retourDashboard() {
    this.router.navigate(['/student']);
  }
}
