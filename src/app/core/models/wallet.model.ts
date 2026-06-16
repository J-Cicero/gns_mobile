export interface Wallet {
  trackingId: string;
  solde: number;
  statutWallet: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  proprietaireTrackingId: string;
  typeProprietaire: 'ETUDIANT' | 'COMMERCANT';
  plafond?: number;
}
