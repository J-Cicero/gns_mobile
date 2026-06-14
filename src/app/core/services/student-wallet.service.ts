import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentWalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) {}

  getStudentWallet(studentId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/students/${studentId}`);
  }

  getStudentTransactions(studentId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/transactions/student/${studentId}`);
  }

  getStudentVersements(walletId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/versements/wallet/${walletId}`);
  }
}
