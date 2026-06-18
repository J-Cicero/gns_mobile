export enum VersementType {
  VERSEMENT_INIT_ETUDIANT = 'VERSEMENT_INIT_ETUDIANT',
  VERSEMENT_INIT_BOUTIQUE = 'VERSEMENT_INIT_BOUTIQUE',
  VERSEMENT_MASSE_ETUDIANTS = 'VERSEMENT_MASSE_ETUDIANTS',
  VERSEMENT_MASSE_BOUTIQUES = 'VERSEMENT_MASSE_BOUTIQUES',
  RETOUR_COMMISSION_GNS = 'RETOUR_COMMISSION_GNS',
  REMBOURSEMENT_ETUDIANT = 'REMBOURSEMENT_ETUDIANT',
  AUTRE = 'AUTRE',
}

export enum VersementStatut {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  ANNULE = 'ANNULE',
  ECHOUE = 'ECHOUE',
}

export interface VersementRequest {
  walletTrackingId: string;
  amount: number; // BigDecimal from backend -> number
  paymentType: VersementType;
  paymentDate?: string; // LocalDateTime from backend -> string
  status?: VersementStatut;
}

export interface VersementResponse {
  trackingId: string;
  walletTrackingId: string;
  amount: number; // BigDecimal from backend -> number
  paymentType: VersementType;
  paymentDate: string; // LocalDateTime from backend -> string
  status: VersementStatut;
}
