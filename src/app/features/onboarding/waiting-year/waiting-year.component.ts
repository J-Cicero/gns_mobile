import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiting-year',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="bg-slate-50 dark:bg-slate-900">
      <div class="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
        <div class="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white dark:border-slate-900">
          <svg class="w-12 h-12 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Année Académique Non Configurée</h2>
        
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 max-w-sm w-full shadow-sm">
          <p class="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Aucune année académique n'est actuellement active sur la plateforme.
          </p>
          <div class="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <p class="text-xs text-indigo-700 dark:text-indigo-300 font-bold">
              Veuillez patienter l'ouverture officielle des inscriptions par l'administration GNS.
            </p>
          </div>
        </div>

        <button (click)="logout()" class="w-full max-w-sm py-3.5 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-[0.98]">
          Se déconnecter
        </button>
      </div>
    </ion-content>
  `
})
export class WaitingYearComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('student_profile');
    this.router.navigate(['/auth/login']);
  }
}
