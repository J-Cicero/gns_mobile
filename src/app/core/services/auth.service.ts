import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          if (res.trackingId) {
            localStorage.setItem('user_tracking_id', res.trackingId);
          }
          if (res.roles) {
            localStorage.setItem('user_role', res.roles);
          }
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  registerMerchantUnified(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/merchant`, formData);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserByTrackingId(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${trackingId}`);
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('user_tracking_id');
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user_tracking_id');
    localStorage.removeItem('user_role');
  }
}
