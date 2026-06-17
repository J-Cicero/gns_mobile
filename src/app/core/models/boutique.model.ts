export interface Boutique {
  trackingId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  kycStatus: string;
  merchantTrackingId: string;
}

export interface Produit {
  trackingId: string;
  nom: string;
  description: string;
  prix: number;
  imageUrl?: string;
}
