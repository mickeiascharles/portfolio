import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar';
import { RastroCursorComponent } from './components/layout/rastro-cursor/rastro-cursor';
import { LanguageService } from './services/language';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, RastroCursorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  readonly language = inject(LanguageService);
  readonly mostrarAbertura = signal(true);

  isMenuOpen = false;

  encerrarAbertura(evento: AnimationEvent) {
    if (evento.target === evento.currentTarget && evento.animationName === 'sumirAbertura') {
      this.mostrarAbertura.set(false);
    }
  }

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
