import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OnboardingStateService {
  private readonly STATE_KEY = 'onboarding_state';

  constructor(private router: Router) {}

  saveState(step: string, data: any) {
    const currentState = this.getState() || {};
    const newState = {
      ...currentState,
      lastStep: step,
      data: { ...currentState.data, ...data }
    };
    localStorage.setItem(this.STATE_KEY, JSON.stringify(newState));
  }

  getState(): any {
    const stateStr = localStorage.getItem(this.STATE_KEY);
    return stateStr ? JSON.parse(stateStr) : null;
  }

  getSavedData(): any {
    const state = this.getState();
    return state ? state.data : {};
  }

  clearState() {
    localStorage.removeItem(this.STATE_KEY);
  }

  resumeState(): boolean {
    const state = this.getState();
    if (state && state.lastStep) {
      this.router.navigate(['/onboarding', state.lastStep]);
      return true;
    }
    return false;
  }
}
