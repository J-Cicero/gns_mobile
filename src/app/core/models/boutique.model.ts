export interface Boutique {
  trackingId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  kycStatus: string;
  merchantTrackingId: string;
  walletTrackingId?: string; // Added from backend
  balance?: number; // Added from backend
  limitAmount?: number; // Added from backend
}

export interface Produit {
  trackingId: string;
  name: string; // Renamed from nom
  description: string;
  price: number; // Renamed from prix
  boutiqueTrackingId: string; // Added from backend
  stock: number; // Added from backend
  isAvailable: boolean; // Added from backend
  addedAt?: string; // Added from backend
  // imageUrl?: string; // Removed as not in backend DTO
}
