import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, scanOutline, cashOutline, backspaceOutline, checkmarkCircle, lockClosed, arrowForwardOutline, qrCodeOutline, personCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ActivatedRoute } from '@angular/router';
import { MerchantService } from '../../../core/services/merchant.service';
import { StudentService } from '../../../core/services/student.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit, OnDestroy {
  montantSaisi = '0';
  pinSaisi = '';
  isScanning = false;
  etudiantId = '';
  etudiantName = '';
  
  // SCAN -> CONFIRM -> AMOUNT -> PIN
  step: 'SCAN' | 'CONFIRM' | 'AMOUNT' | 'PIN' = 'SCAN';
  boutiqueId: string | null = null;
  private sub: Subscription | null = null;

  constructor(
    private toastCtrl: ToastController, 
    private route: ActivatedRoute,
    private merchantService: MerchantService,
    private studentService: StudentService
  ) {
    addIcons({ arrowBackOutline, scanOutline, cashOutline, backspaceOutline, checkmarkCircle, lockClosed, arrowForwardOutline, qrCodeOutline, personCircleOutline, closeCircleOutline });
  }

  ngOnInit() {
    this.sub = this.merchantService.selectedBoutiqueId$.subscribe(id => {
      this.boutiqueId = id;
    });

    this.route.queryParams.subscribe(params => {
      if (params['montant']) {
        this.montantSaisi = params['montant'];
        this.step = 'SCAN'; 
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isScanning) return;

    const key = event.key;
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
      this.ajouterChiffre(key);
    } else if (key === 'Backspace') {
      this.supprimerChiffre();
    } else if (key === 'Enter') {
      if (this.step === 'AMOUNT') this.validerMontant();
      else if (this.step === 'PIN') this.validerPaiement();
      else if (this.step === 'CONFIRM') this.step = 'AMOUNT';
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top',
      cssClass: 'premium-toast'
    });
    toast.present();
  }

  ajouterChiffre(chiffre: string) {
    if (this.step === 'AMOUNT') {
      if (this.montantSaisi === '0') this.montantSaisi = chiffre;
      else this.montantSaisi += chiffre;
    } else if (this.step === 'PIN') {
      if (this.pinSaisi.length < 4) {
        this.pinSaisi += chiffre;
      }
    }
  }

  supprimerChiffre() {
    if (this.step === 'AMOUNT') {
      if (this.montantSaisi.length > 1) this.montantSaisi = this.montantSaisi.slice(0, -1);
      else this.montantSaisi = '0';
    } else if (this.step === 'PIN') {
      if (this.pinSaisi.length > 0) {
        this.pinSaisi = this.pinSaisi.slice(0, -1);
      }
    }
  }

  async scannerEtudiant() {
    this.isScanning = true;
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        document.body.classList.add('scanner-active');
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan();
        document.body.classList.remove('scanner-active');
        BarcodeScanner.showBackground();
        BarcodeScanner.stopScan();
        this.isScanning = false;
        if (result.hasContent) {
          this.loadStudentInfo(result.content);
        }
      } else {
        this.isScanning = false;
        this.showToast("Permission caméra refusée", "danger");
      }
    } catch (e) {
      this.isScanning = false;
      this.showToast("Erreur lors de l'accès à la caméra.", "danger");
    }
  }

  loadStudentInfo(trackingId: string) {
    this.isScanning = true;
    this.etudiantId = trackingId;
    this.studentService.getStudentByTrackingId(trackingId).subscribe({
      next: (student: any) => {
        this.etudiantName = `${student.prenom} ${student.nom}`;
        this.step = 'CONFIRM';
        this.isScanning = false;
      },
      error: () => {
        this.etudiantName = "Étudiant non reconnu";
        this.step = 'CONFIRM';
        this.isScanning = false;
        this.showToast("Étudiant introuvable", "danger");
      }
    });
  }

  validerMontant() {
    if (parseInt(this.montantSaisi) > 0) {
      this.step = 'PIN';
    } else {
      this.showToast("Saisissez un montant.", "warning");
    }
  }

  annulerPaiement() {
    this.step = 'SCAN';
    this.montantSaisi = '0';
    this.pinSaisi = '';
    this.etudiantId = '';
    this.etudiantName = '';
  }

  validerPaiement() {
    if (this.pinSaisi.length !== 4) {
      this.showToast("PIN incomplet.", "danger");
      return;
    }
    if (!this.boutiqueId) {
      this.showToast("Boutique non sélectionnée.", "warning");
      return;
    }

    this.isScanning = true;

    const orderData = {
      reference: 'ACHAT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      studentTrackingId: this.etudiantId,
      boutiqueTrackingId: this.boutiqueId,
      montantTotal: parseFloat(this.montantSaisi),
      pinCode: this.pinSaisi
    };

    this.merchantService.createOrder(orderData).subscribe({
      next: (res) => {
        this.merchantService.payerCommande(res.trackingId, this.pinSaisi).subscribe({
          next: () => {
            this.isScanning = false;
            this.showToast(`Paiement de ${this.montantSaisi} FCFA réussi !`, 'success');
            this.annulerPaiement();
          },
          error: (err) => {
            this.isScanning = false;
            this.showToast("Échec : " + (err.error?.message || "PIN incorrect ou solde insuffisant"), "danger");
          }
        });
      },
      error: (err) => {
        this.isScanning = false;
        this.showToast("Erreur commande : " + (err.error?.message || "Erreur serveur"), "danger");
      }
    });
  }
}
