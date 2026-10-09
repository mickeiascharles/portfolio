import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar';
import { RastroCursorComponent } from './components/layout/rastro-cursor/rastro-cursor';
import { LanguageService } from './services/language';
import { SomService } from './services/som';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, RastroCursorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  readonly language = inject(LanguageService);
  private readonly som = inject(SomService);
  readonly mostrarAbertura = signal(true);

  isMenuOpen = false;

  encerrarAbertura(evento: AnimationEvent) {
    if (evento.target === evento.currentTarget && evento.animationName === 'sumirAbertura') {
      this.mostrarAbertura.set(false);
    }
  }

  toggleMenu() {
    this.som.tocar('click.mp3', 0.4);
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
