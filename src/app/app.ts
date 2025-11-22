import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
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
}
