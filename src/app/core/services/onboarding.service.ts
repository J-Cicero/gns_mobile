import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudentRequest } from '../models/student.model'; // Assuming student.model contains StudentRequest
import { InscriptionAnnuelleRequest } from '../models/inscription-annuelle.model'; // Assuming inscription-annuelle.model contains InscriptionAnnuelleRequest

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor(private http: HttpClient) {}

  registerStudent(request: StudentRequest, ribFile?: File, mandatFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    
    if (ribFile) {
      formData.append('rib', ribFile);
    }
    if (mandatFile) {
      formData.append('mandat', mandatFile);
    }

    return this.http.post<any>(`${environment.apiUrl}/students`, formData);
  }

  getBanques(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/banques`);
  }

  submitAcademicInfo(request: InscriptionAnnuelleRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/inscriptions/simple`, request);
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
