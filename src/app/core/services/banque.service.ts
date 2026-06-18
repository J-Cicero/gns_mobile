import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BanqueService {
  private apiUrl = `${environment.apiUrl}/banques/comptes-gns`; // Endpoint pour les comptes bancaires unifiés

  constructor(private http: HttpClient) {}

  getStudentBankAccount(studentTrackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/proprietaire/${studentTrackingId}`);
  }

  getAllBanques(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/banques`);
  }
}
