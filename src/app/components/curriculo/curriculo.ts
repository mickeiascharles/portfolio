import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-curriculo',
  standalone: true,
  imports: [NgFor],
  templateUrl: './curriculo.html',
  styleUrl: './curriculo.css',
})
export class CurriculoComponent {
  readonly language = inject(LanguageService);
}
