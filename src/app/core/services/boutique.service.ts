import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Boutique, Produit } from '../models/boutique.model';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private apiUrl = `${environment.apiUrl}/boutiques`;

  constructor(private http: HttpClient) {}

  getBoutiques(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getProduitsByBoutique(boutiqueTrackingId: string, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products/boutique/${boutiqueTrackingId}?page=${page}&size=${size}`);
  }
}
