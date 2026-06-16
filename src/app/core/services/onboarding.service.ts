import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    const payload = {
      firstName: data.prenom,
      lastName: data.nom,
      email: data.email,
      phoneNumber: data.telephone,
      password: data.password,
      dateOfBirth: "2000-01-01", // Valeur par défaut pour l'inscription mobile si non fournie
      gender: "M" // Valeur par défaut
    };
    return this.http.post<any>(`${environment.apiUrl}/students`, payload);
  }

  submitAcademicInfo(studentTrackingId: string, data: any): Observable<any> {
    const payload = {
      studentTrackingId: studentTrackingId,
      universiteTrackingId: data.universiteTrackingId,
      scolariteYearTrackingId: data.scolariteYearTrackingId,
      matricule: data.matricule,
      statutInscription: "EN_ATTENTE"
    };
    return this.http.post<any>(`${environment.apiUrl}/inscriptions/simple`, payload);
  }

  checkEligibility(inscriptionTrackingId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/inscriptions/${inscriptionTrackingId}/synchroniser`, {});
  }

  getUniversites(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/universites`);
  }

  getActiveScolariteYear(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/scolarite-years/active`);
  }
}
