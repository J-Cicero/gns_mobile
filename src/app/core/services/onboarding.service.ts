import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor(private http: HttpClient) {}

  registerStudent(data: any, ribFile?: File, mandatFile?: File): Observable<any> {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      studentIdNumber: data.studentIdNumber,
      universiteTrackingId: data.universiteTrackingId,
      bankTrackingId: data.bankTrackingId,
      accountNumber: data.accountNumber,
      birthDate: data.birthDate,
      birthPlace: data.birthPlace,
      pinCodeHash: data.pinCodeHash // Ajout du code PIN
    };

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    
    if (ribFile) {
      formData.append('rib', ribFile);
    }
    if (mandatFile) {
      formData.append('mandat', mandatFile);
    }

    return this.http.post<any>(`${environment.apiUrl}/users/register/student`, formData);
  }

  registerMerchant(data: any, ribFile: File): Observable<any> {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      businessName: data.businessName,
      bankTrackingId: data.bankTrackingId,
      accountNumber: data.accountNumber
    };

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    
    if (ribFile) {
      formData.append('rib', ribFile);
    }

    return this.http.post<any>(`${environment.apiUrl}/users/register/merchant`, formData);
  }

  getBanques(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/banques`);
  }

  submitAcademicInfo(studentTrackingId: string, data: any): Observable<any> {
    const payload = {
      studentTrackingId: studentTrackingId, // Cet ID est déjà fourni par le composant
      universiteTrackingId: data.universiteTrackingId, // Vient maintenant du studentProfile
      scolariteYearTrackingId: data.scolariteYearTrackingId,
      matricule: data.matricule, // Vient maintenant du studentProfile
      studyLevel: data.studyLevel, // Nouveau nom pour le niveau d'étude
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
