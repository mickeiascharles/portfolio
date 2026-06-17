import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar';
import { LanguageService } from './services/language';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  readonly language = inject(LanguageService);

  title = 'mickeiascharles';
  isMenuOpen = false;

  playMenuSound() {
    const audio = new Audio('assets/click.mp3');
    audio.volume = 0.4;
    audio.play().catch((err) => console.warn('Erro ao tocar som:', err));
  }

  toggleMenu() {
    this.playMenuSound();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
