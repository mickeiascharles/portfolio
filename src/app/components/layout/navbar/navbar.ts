import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../../services/language';
import { SomService } from '../../../services/som';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  readonly language = inject(LanguageService);
  private readonly som = inject(SomService);

  @Output() linkClicked = new EventEmitter<void>();

  playHoverSound() {
    this.som.tocar('hover.mp3', 0.2);
  }

  playNameSound() {
    this.som.tocar('name.mp3', 0.3);
  }

  handleLinkClick() {
    this.som.tocar('click.mp3', 0.4);
    this.linkClicked.emit();
  }
}
