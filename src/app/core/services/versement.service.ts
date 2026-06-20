import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersementService {
  private apiUrl = `${environment.apiUrl}/versements`;

  constructor(private http: HttpClient) {}

  createMasseEtudiants(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/masse/etudiants`, data);
  }

  effectuerVersementMasseBoutiques(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/masse/boutiques`, data);
  }

  remiseAZeroMasseEtudiants(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/masse/reset/etudiants`, data);
  }

  previewMasseEtudiants(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/masse/preview/etudiants`);
  }

  previewMasseBoutiques(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/masse/preview/boutiques`);
  }

  remiseAZeroMasseBoutiques(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/masse/reset/boutiques`, data);
  }

  findByTrackingId(trackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}`);
  }

  update(trackingId: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${trackingId}`, data);
  }

  delete(trackingId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${trackingId}`);
  }

  findByStatut(statut: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statut/${statut}`);
  }

  findByTypeVersement(typeVersement: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type/${typeVersement}`);
  }

  findByWalletTrackingId(walletTrackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wallet/${walletTrackingId}`);
  }
}
