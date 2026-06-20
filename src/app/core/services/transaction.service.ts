import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getGlobalStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/global`);
  }

  findByTrackingId(trackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}`);
  }

  findByBoutiqueId(boutiqueId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/boutique/${boutiqueId}`);
  }

  findByStudentId(studentId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/${studentId}`);
  }
}
