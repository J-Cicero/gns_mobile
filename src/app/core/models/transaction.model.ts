export interface Transaction {
  trackingId: string;
  senderTrackingId: string;
  receiverTrackingId: string;
  senderName: string;
  receiverName: string;
  amount: number;
  amountDebited: number;
  amountCredited: number;
  status: 'EN_ATTENTE' | 'VALIDEE' | 'ECHOUEE' | 'ANNULEE';
  typeTransaction: 'PAIEMENT' | 'VERSEMENT' | 'RETRAIT';
  createdAt: string;
}
