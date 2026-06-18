export interface StudentProfile {
  trackingId: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
  birthPlace?: string;
  studentIdNumber: string; // Corresponds to matricule
  kycStatus: 'PENDING' | 'VALIDATED' | 'REJECTED'; // Corresponds to statutKYC
  isActive: boolean; // Added from backend
  isEligible: boolean; // Derived frontend logic
  isOnboardingComplete: boolean; // Derived frontend logic
  walletTrackingId?: string;
  balance?: number;
  universiteTrackingId?: string;
  universiteFullName?: string;
  // universiteCode?: string; // Removed as not in backend DTO
}

export interface StudentRequest {
  email: string;
  password?: string;
  lastName: string;
  firstName: string;
  isActive?: boolean;
  phoneNumber: string;
  birthDate?: string;
  birthPlace?: string;
  studentIdNumber?: string;
  kycStatus?: 'PENDING' | 'VALIDATED' | 'REJECTED';
  walletTrackingId?: string;
  bankTrackingId?: string;
  accountNumber?: string;
  universiteTrackingId?: string;
}
