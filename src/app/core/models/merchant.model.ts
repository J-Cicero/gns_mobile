export type KycStatus = 'NOT_STARTED' | 'PENDING' | 'VALIDATED' | 'REJECTED';

export interface MerchantProfile {
  trackingId: string;
  email: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  rolesList?: string[];
  kycStatus: KycStatus;
  walletTrackingId?: string;
  balance?: number;
  isOnboardingComplete?: boolean;
  businessName?: string;
  registrationNumber?: string;
}

export interface Boutique {
  trackingId: string;
  merchantTrackingId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  kycStatus: string;
  walletTrackingId?: string;
}

export interface LiquidationRequest {
  merchantTrackingId: string;
  walletTrackingId: string;
  montant: number;
  compteBancaireTrackingId: string;
  motif?: string;
}
