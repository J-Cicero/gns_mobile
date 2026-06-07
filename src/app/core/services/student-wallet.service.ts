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

  getStudentWallet(): Observable<any> {
    // Dans une app réelle, l'ID serait récupéré depuis le token JWT ou l'authService
    return this.http.get<any>(`${this.apiUrl}/my-wallet`);
  }
}
