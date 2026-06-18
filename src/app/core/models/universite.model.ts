import { Page } from './page.model';

export interface UniversiteRequest {
  code: string;
  fullName: string;
  city: string;
  isActive: boolean;
}

export interface UniversiteResponse {
  trackingId: string;
  code: string;
  fullName: string;
  city: string;
  isActive: boolean;
}
