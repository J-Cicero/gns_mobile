export interface Boutique {
  trackingId: string;
  nom: string;
  code: string;
  adresse: string;
  latitude?: number;
  longitude?: number;
  categorie?: string;
  telephone?: string;
  statutBoutique: 'OUVERT' | 'FERME' | 'SUSPENDU';
  merchantTrackingId: string;
}

export interface Produit {
  trackingId: string;
  nom: string;
  description: string;
  prix: number;
  imageUrl?: string;
}
