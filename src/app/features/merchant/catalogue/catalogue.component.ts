import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent {
  produits = [
    { nom: 'Plat du jour', prix: 800, disponible: true },
    { nom: 'Boisson locale', prix: 300, disponible: true },
    { nom: 'Sandwich Poulet', prix: 1200, disponible: false },
    { nom: 'Eau minérale', prix: 200, disponible: true }
  ];

  constructor() {
    addIcons({ addOutline, arrowBackOutline });
  }
}