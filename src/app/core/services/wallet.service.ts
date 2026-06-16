import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Wallet } from '../models/wallet.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) {}

  getMyWallet(walletTrackingId: string): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/${walletTrackingId}`);
  }

  getRecentTransactions(studentTrackingId: string, limit: number = 5): Observable<{content: Transaction[]}> {
    return this.http.get<{content: Transaction[]}>(`${environment.apiUrl}/transactions/student/${studentTrackingId}?page=0&size=${limit}`);
  }

  pay(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/transactions`, payload);
  }

  getBoutiqueTransactions(boutiqueTrackingId: string, limit: number = 5): Observable<{content: Transaction[]}> {
    return this.http.get<{content: Transaction[]}>(`${environment.apiUrl}/transactions/boutique/${boutiqueTrackingId}?page=0&size=${limit}`);
  }
}
