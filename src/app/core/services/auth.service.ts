import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    // Étape 1 : Appel à /users/login pour obtenir le token et l'ID
    return this.http.post<any>(`${environment.apiUrl}/users/login`, credentials).pipe(
      switchMap(res => {
        if (res && res.token && res.trackingId) {
          localStorage.setItem('access_token', res.token);
          // Étape 2 : Récupérer le profil étudiant complet avec le trackingId
          return this.http.get<any>(`${environment.apiUrl}/students/${res.trackingId}`).pipe(
            tap(student => {
              // Mettre à jour le statut KYC et d'autres attributs si nécessaires, puis stocker le profil
              const profileToStore = {
                ...student,
                prenom: student.firstName,
                nom: student.lastName,
                email: student.email,
                telephone: student.phoneNumber,
                matricule: student.studentIdNumber,
                faculte: student.universiteFullName || 'Non renseigné',
                statutKYC: student.kycStatus,
                isEligible: true, // À adapter selon le backend
                isOnboardingComplete: student.kycStatus === 'VALIDATED' // Ou selon la logique
              };
              localStorage.setItem('student_profile', JSON.stringify(profileToStore));
            }),
            map(() => res) // On retourne la réponse originale de login
          );
        } else {
          return of(res);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('student_profile');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getCurrentProfile(): any {
    const profile = localStorage.getItem('student_profile');
    return profile ? JSON.parse(profile) : null;
  }

  getCurrentUserId(): string | null {
    const profile = this.getCurrentProfile();
    return profile ? profile.trackingId : null;
  }
}
