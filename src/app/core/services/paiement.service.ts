import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionResponse } from '../models/transaction.model'; // Import TransactionResponse

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = `${environment.apiUrl}/transactions`; // Changed to transactions

  constructor(private http: HttpClient) {}

  getStudentTransactions(studentTrackingId: string, page: number = 0, size: number = 10): Observable<any> { // Renamed from findAll
    return this.http.get<any>(`${this.apiUrl}/student/${studentTrackingId}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }
}
