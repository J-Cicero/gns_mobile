import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'gns_theme_preference';
  private _isDark = false;

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this._isDark = savedTheme === 'dark';
    } else {
      // Par défaut on force le Dark Mode pour l'expérience GNS Premium
      this._isDark = true;
      localStorage.setItem(this.THEME_KEY, 'dark');
    }
    this.applyTheme();
  }

  public get isDark(): boolean {
    return this._isDark;
  }

  public toggleTheme() {
    this._isDark = !this._isDark;
    localStorage.setItem(this.THEME_KEY, this._isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this._isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
