import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  findByTrackingId(trackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}`);
  }

  updateTrackingid(trackingId: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${trackingId}`, data);
  }

  delete(trackingId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${trackingId}`);
  }

  getStudentStudenttrackingid(studentTrackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/${studentTrackingId}`);
  }

  getStatutCardstatus(cardStatus: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statut/${cardStatus}`);
  }

  createTrackingidDeclareLost(trackingId: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${trackingId}/declare-lost`, data);
  }
}
