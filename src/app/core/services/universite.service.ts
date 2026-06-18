import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../models/page.model';
import { UniversiteResponse } from '../models/universite.model';

@Injectable({
  providedIn: 'root'
})
export class UniversiteService {
  private apiUrl = `${environment.apiUrl}/universites`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Page<UniversiteResponse>> {
    return this.http.get<Page<UniversiteResponse>>(this.apiUrl);
  }
}
