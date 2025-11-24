import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  @Output() linkClicked = new EventEmitter<void>();

  menuItems = [
    { label: 'Projetos', route: '/projetos' },
    { label: 'Hobbies', route: '/hobbies' },
    { label: 'Sobre mim', route: '/sobre' },
    { label: 'Currículo Pdf.', route: '/curriculo' },
  ];

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
