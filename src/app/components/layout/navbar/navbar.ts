import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  readonly language = inject(LanguageService);

  @Output() linkClicked = new EventEmitter<void>();

  playHoverSound() {
    const audio = new Audio('assets/hover.mp3');
    audio.volume = 0.2;
    audio.play().catch((err) => console.warn(err));
  }

  playClickSound() {
    const audio = new Audio('assets/click.mp3');
    audio.volume = 0.4;
    audio.play().catch((err) => console.warn(err));
  }

  playNameSound() {
    const audio = new Audio('assets/name.mp3');
    audio.volume = 0.3;
    audio.play().catch((err) => console.warn(err));
  }

  handleLinkClick() {
    this.playClickSound();
    this.linkClicked.emit();
  }
}
