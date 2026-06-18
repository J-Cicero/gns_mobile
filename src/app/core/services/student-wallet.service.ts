import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../models/page.model'; // Assuming a generic Page interface exists
import { StudentProfile } from '../models/student.model'; // Import StudentProfile
import { TransactionResponse } from '../models/transaction.model'; // Import TransactionResponse
import { VersementResponse } from '../models/versement.model'; // Import VersementResponse


@Injectable({
  providedIn: 'root'
})
export class StudentWalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) {}

  getStudentWallet(studentId: string): Observable<StudentProfile> {
    // This returns StudentResponse which contains wallet details
    return this.http.get<StudentProfile>(`${environment.apiUrl}/students/${studentId}`);
  }

  getStudentTransactions(studentId: string, page: number = 0, size: number = 10): Observable<Page<TransactionResponse>> {
    return this.http.get<Page<TransactionResponse>>(`${environment.apiUrl}/transactions/student/${studentId}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getStudentVersements(walletId: string, page: number = 0, size: number = 10): Observable<Page<VersementResponse>> {
    return this.http.get<Page<VersementResponse>>(`${environment.apiUrl}/versements/wallet/${walletId}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }
}
