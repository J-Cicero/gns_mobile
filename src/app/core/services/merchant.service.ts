import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private apiUrl = environment.apiUrl;
  
  private selectedBoutiqueSource = new BehaviorSubject<string | null>(localStorage.getItem('selectedBoutiqueId'));
  selectedBoutiqueId$ = this.selectedBoutiqueSource.asObservable();

  constructor(private http: HttpClient) {}

  setSelectedBoutiqueId(boutiqueId: string) {
    localStorage.setItem('selectedBoutiqueId', boutiqueId);
    this.selectedBoutiqueSource.next(boutiqueId);
  }

  getSelectedBoutiqueId(): string | null {
    return this.selectedBoutiqueSource.getValue();
  }

  registerMerchant(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/merchants`, payload);
  }

  getMerchantProfile(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/merchants/${trackingId}`);
  }

  uploadDocument(merchantTrackingId: string, typeDocument: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('merchantTrackingId', merchantTrackingId);
    formData.append('typeDocument', typeDocument);
    return this.http.post<any>(`${this.apiUrl}/merchants/documents/upload`, formData);
  }

  requestLiquidation(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/liquidations`, payload);
  }

  getBoutiquesByMerchant(merchantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/boutiques/merchant/${merchantId}`);
  }

  getBoutiqueById(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/boutiques/${trackingId}`);
  }

  updateBoutique(trackingId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/boutiques/${trackingId}`, data);
  }

  getProducts(boutiqueId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/boutique/${boutiqueId}`);
  }

  getSalesHistory(boutiqueId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/commandes/boutique/${boutiqueId}`);
  }

  addProduct(boutiqueId: string, productData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, productData); // Adjust if specific path requires boutiqueId in URL, usually DTO has it
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/commandes`, orderData);
  }

  payerCommande(trackingId: string, pinCode: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/commandes/${trackingId}/payer`, { pinCode });
  }

  createBoutique(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/boutiques`, data);
  }
}
