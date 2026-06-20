import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  registerStudent(studentData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, studentData);
  }

  registerStudentUnified(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData); // Pointing to POST /students
  }

  getActiveYear(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/scolarite-years/active`);
  }

  getInscriptionByYear(studentTrackingId: string, anneeAcademique: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/inscriptions/student/${studentTrackingId}/annee/${anneeAcademique}`);
  }

  createInscription(inscriptionData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/inscriptions`, inscriptionData);
  }

  synchronizeInscription(trackingId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/inscriptions/${trackingId}/synchroniser`, {});
  }

  getDocuments(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}/documents`);
  }

  getInscriptionStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me/inscription-active`);
  }

  getCurrentStudent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  getStudentByTrackingId(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}`);
  }

  getStudentCard(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}/card`);
  }

  getStudentInscriptions(trackingId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/inscriptions/student/${trackingId}`);
  }


  uploadDocument(trackingId: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${trackingId}/documents/upload`, data);
  }

  findByTrackingId(trackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}`);
  }

  update(trackingId: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${trackingId}`, data);
  }

  assignerMatricule(trackingId: any, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${trackingId}/matricule`, data);
  }

  delete(trackingId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${trackingId}`);
  }

  findByStatutKYC(statutKYC: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/kyc/${statutKYC}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getTotalStudents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/total`);
  }

  getCard(trackingId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${trackingId}/card`);
  }
}
