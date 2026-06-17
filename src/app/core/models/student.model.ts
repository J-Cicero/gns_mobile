export interface StudentProfile {
  trackingId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  birthDate?: string; // Ajouté
  birthPlace?: string; // Ajouté
  matricule: string;
  universiteTrackingId?: string;
  universiteFullName?: string; // Ajouté
  universiteCode?: string; // Ajouté
  statutKYC: 'PENDING' | 'VALIDATED' | 'REJECTED';
  isEligible: boolean;
  isOnboardingComplete: boolean;
  walletTrackingId?: string;
  balance?: number;
}
