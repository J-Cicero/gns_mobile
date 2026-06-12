import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { AuthService } from '../services/auth.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const documentGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const studentService = inject(StudentService);
  const authService = inject(AuthService);

  const studentId = authService.getCurrentUserId();
  
  if (!studentId) {
    return of(router.createUrlTree(['/login']));
  }

  // 1. Récupérer l'année scolaire active
  return studentService.getActiveYear().pipe(
    switchMap(activeYear => {
      if (!activeYear || !activeYear.anneeAcademique) {
        // Pas d'année active, on bloque ou on redirige vers une erreur
        return of(router.createUrlTree(['/student/waiting'], { queryParams: { error: 'no_active_year' } }));
      }
      
      // 2. Vérifier l'inscription pour cette année
      return studentService.getInscriptionByYear(studentId, activeYear.anneeAcademique).pipe(
        map(inscription => {
          if (inscription.statut === 'EN_ATTENTE') {
            return router.createUrlTree(['/student/waiting']); // Cas B
          } else if (inscription.statut === 'VALIDEE' || inscription.statut === 'INSCRIT_DEFINITIF') {
            return true; // Cas C
          } else {
            return router.createUrlTree(['/student/documents']); // Cas A (autre statut non validé)
          }
        }),
        catchError(() => {
          // Cas A : Pas d'inscription (404)
          return of(router.createUrlTree(['/student/documents']));
        })
      );
    }),
    catchError(() => {
      return of(router.createUrlTree(['/student/documents']));
    })
  );
};
