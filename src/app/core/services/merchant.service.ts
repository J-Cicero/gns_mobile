import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionRequest, TransactionResponse } from '../models/transaction.model'; // Import Transaction models

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

  registerMerchant(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/merchants`, formData);
  }

  getMerchantProfile(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/merchants/${trackingId}`);
  }

  getBanks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/banques`);
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
    return this.http.get<any>(`${this.apiUrl}/transactions/boutique/${boutiqueId}`); // Updated to use TransactionController
  }

  addProduct(boutiqueId: string, productData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, productData);
  }

  // Renamed from createOrder to initiateDirectPayment, now calls backend TransactionController's createPayment
  initiateDirectPayment(request: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/transactions`, request);
  }
  
  // createBoutique method should be part of MerchantService.create or a dedicated BoutiqueService
  // but it's currently defined here. For a student app, it might not be relevant.
  // Assuming it stays here for now if needed, but consider moving it to MerchantService create method.
  createBoutique(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/boutiques`, data);
  }
}
