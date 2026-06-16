export interface StudentProfile {
  trackingId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matricule: string;
  faculte: string;
  statutKYC: 'PENDING' | 'VALIDATED' | 'REJECTED';
  isEligible: boolean;
  isOnboardingComplete: boolean;
  walletTrackingId?: string;
  balance?: number;
}
