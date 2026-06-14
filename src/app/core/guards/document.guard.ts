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
      if (!activeYear || !activeYear.libelle) {
        // Pas d'année active, on redirige vers la page dédiée
        return of(router.createUrlTree(['/student/no-active-year']));
      }
      
      // 2. Vérifier l'inscription pour cette année
      return studentService.getInscriptionByYear(studentId, activeYear.libelle).pipe(
        map(inscription => {
          // Si l'inscription est déjà vérifiée et éligible, accès direct au Wallet
          if (inscription.estEligibleBourse) {
            return true;
          }

          // Sinon, on redirige vers l'éligibilité pour vérifier
          return router.createUrlTree(['/student/eligibility']);
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
