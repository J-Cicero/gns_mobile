export enum WalletType {
  STUDENT = 'STUDENT',
  BOUTIQUE = 'BOUTIQUE',
  GNS = 'GNS',
  BANQUE = 'BANQUE',
}

export enum WalletStatus {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  BLOQUE = 'BLOQUE',
  FERME = 'FERME',
}

export enum WalletFundingLevel {
  FAIBLE = 'FAIBLE',
  NORMAL = 'NORMAL',
  ELEVE = 'ELEVE',
}

export interface WalletResponse {
  trackingId: string;
  walletType: WalletType;
  status: WalletStatus;
  fundingLevel: WalletFundingLevel;
  balance: number; // BigDecimal from backend -> number
  limitAmount: number; // BigDecimal from backend -> number
  currency: string;
  createdAt: string; // LocalDateTime from backend -> string
  studentTrackingId?: string; // UUID from backend -> string (if wallet is for a student)
  ownerName?: string;
}
