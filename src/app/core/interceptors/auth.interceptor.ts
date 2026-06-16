import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('student_profile');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
