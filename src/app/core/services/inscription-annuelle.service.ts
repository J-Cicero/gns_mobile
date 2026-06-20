import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InscriptionAnnuelleRequest,
  InscriptionAnnuelleResponse
} from '../models/inscription-annuelle.model';
import { StatutInscription } from '../models/inscription-annuelle.model'; // Added for potential future use or context

@Injectable({
  providedIn: 'root'
})
export class InscriptionAnnuelleService {
  private apiUrl = `${environment.apiUrl}/inscriptions`;

  constructor(private http: HttpClient) {}

  createSimpleInscription(request: InscriptionAnnuelleRequest): Observable<InscriptionAnnuelleResponse> {
    return this.http.post<InscriptionAnnuelleResponse>(`${this.apiUrl}/simple`, request);
  }

  createWithCarte(request: InscriptionAnnuelleRequest, carte: File): Observable<InscriptionAnnuelleResponse> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    formData.append('carte', carte);

    return this.http.post<InscriptionAnnuelleResponse>(this.apiUrl, formData);
  }

  // Other endpoints from backend InscriptionAnnuelleController
  findByTrackingId(trackingId: string): Observable<InscriptionAnnuelleResponse> {
    return this.http.get<InscriptionAnnuelleResponse>(`${this.apiUrl}/${trackingId}`);
  }

  update(trackingId: string, request: InscriptionAnnuelleRequest): Observable<InscriptionAnnuelleResponse> {
    return this.http.put<InscriptionAnnuelleResponse>(`${this.apiUrl}/${trackingId}`, request);
  }

  updateStatus(trackingId: string, statut: StatutInscription): Observable<InscriptionAnnuelleResponse> {
    return this.http.patch<InscriptionAnnuelleResponse>(`${this.apiUrl}/${trackingId}/statut`, null, {
      params: { statut: statut }
    });
  }

  updateDefinitif(trackingId: string, estInscritDefinitif: boolean): Observable<InscriptionAnnuelleResponse> {
    return this.http.patch<InscriptionAnnuelleResponse>(`${this.apiUrl}/${trackingId}/definitif`, null, {
      params: { estInscritDefinitif: estInscritDefinitif }
    });
  }

  synchroniser(trackingId: string): Observable<InscriptionAnnuelleResponse> {
    return this.http.post<InscriptionAnnuelleResponse>(`${this.apiUrl}/${trackingId}/synchroniser`, {});
  }

  delete(trackingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${trackingId}`);
  }

  findByStudentTrackingId(studentTrackingId: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/${studentTrackingId}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  findByStudentAndAnnee(studentTrackingId: string, anneeAcademique: string): Observable<InscriptionAnnuelleResponse> {
    return this.http.get<InscriptionAnnuelleResponse>(`${this.apiUrl}/student/${studentTrackingId}/annee/${anneeAcademique}`);
  }

  findAll(page: number, size: number): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  findByUniversite(universiteTrackingId: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/universite/${universiteTrackingId}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }


  createSimple(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/simple`, data);
  }

  getTrackingid(trackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}`);
  }

  updateTrackingid(trackingId: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${trackingId}`, data);
  }

  deleteTrackingid(trackingId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${trackingId}`);
  }

  getStudentStudenttrackingid(studentTrackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/${studentTrackingId}`);
  }

  getStudentStudenttrackingidAnneeAnneeacademique(studentTrackingId: any, anneeAcademique: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/${studentTrackingId}/annee/${anneeAcademique}`);
  }
}
