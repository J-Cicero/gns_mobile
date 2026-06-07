import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private apiUrl = `${environment.apiUrl}/boutiques`;

  constructor(private http: HttpClient) {}

  getProducts(boutiqueId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${boutiqueId}/products`);
  }

  getSalesHistory(boutiqueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${boutiqueId}/sales-history`);
  }

  addProduct(boutiqueId: string, productData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${boutiqueId}/products`, productData);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/commandes`, orderData);
  }
}
