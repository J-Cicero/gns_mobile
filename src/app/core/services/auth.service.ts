import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  registerMerchantUnified(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/merchants/unified-registration`, formData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, credentials).pipe(
      switchMap(res => {
        if (res && res.token && res.trackingId) {
          localStorage.setItem('access_token', res.token);
          return this.http.get<any>(`${environment.apiUrl}/students/${res.trackingId}`).pipe(
            tap(student => {
              const profileToStore = {
                ...student,
                trackingId: student.trackingId,
                lastName: student.lastName,
                firstName: student.firstName,
                email: student.email,
                phoneNumber: student.phoneNumber,
                studentIdNumber: student.studentNumber || student.studentIdNumber,
                universiteTrackingId: student.universiteTrackingId || null,
                universiteFullName: student.universiteFullName || 'Non renseigné',
                birthDate: student.birthDate,
                birthPlace: student.birthPlace,
                kycStatus: student.kycStatus, // Utilise directement kycStatus
                isActive: student.isActive, // Ajout de isActive
                walletTrackingId: student.walletTrackingId,
                balance: student.balance,
                isEligible: true, // Garder comme logique frontend dérivée
                isOnboardingComplete: student.kycStatus === 'VALIDATED' // Garder comme logique frontend dérivée
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

  evaluateStudentOnboardingState(): Observable<string> {
    const trackingId = this.getCurrentUserId();
    if (!trackingId) return of('/auth/login');

    return this.http.get<any>(`${environment.apiUrl}/scolarite-years/active`).pipe(
      switchMap(activeYear => {
        if (!activeYear || !activeYear.trackingId) {
          return of('/student/waiting');
        }

        return this.http.get<any>(`${environment.apiUrl}/inscriptions/student/${trackingId}`).pipe(
          catchError((_: any) => of({ content: [] })),
          switchMap((response: any) => {
            const inscriptionsArray = Array.isArray(response) ? response : (response?.content || []);
            const activeInscription = inscriptionsArray.find((i: any) => i.academicYearLabel === activeYear.label);

            if (!activeInscription) {
              return of('/onboarding/academic-enrollment');
            }

            if (activeInscription.status === 'EN_ATTENTE' || activeInscription.status === 'DOCUMENTS_EN_COURS' || activeInscription.status === 'VERIFIE_UL') {
               return of('/onboarding/eligibility?status=PENDING');
            } else if (activeInscription.status === 'REJETEE') {
               return of('/onboarding/eligibility?status=REJECTED');
            }

            localStorage.setItem('inscription_tracking_id', activeInscription.trackingId);

            return this.http.get<any>(`${environment.apiUrl}/students/${trackingId}`).pipe(
              map(student => {
                const kycStatus = student.kycStatus || 'PENDING';

                const currentProfile = JSON.parse(localStorage.getItem('student_profile') || '{}');
                localStorage.setItem('student_profile', JSON.stringify({
                  ...currentProfile,
                  ...student,
                  kycStatus: kycStatus,
                  isOnboardingComplete: kycStatus === 'VALIDATED'
                }));

                // KYC validation no longer blocks dashboard access
                return '/main/dashboard';
              }),
              catchError((_: any) => of('/onboarding/eligibility'))
            );
          })
        );
      }),
      catchError((err: any) => {
        if (err.status === 404) {
          return of('/student/waiting');
        }
        return of('/auth/login');
      })
    );
  }
}
