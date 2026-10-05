import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../services/language';
import { albumPhotos } from './photos';

const FOTOS_PRE_CARREGADAS = 2;

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.html',
  styleUrl: './album.css',
})
export class AlbumComponent {
  readonly language = inject(LanguageService);
  readonly fotos = albumPhotos;
  readonly indiceGaleria = signal(0);
  @ViewChild('faixaFotos') faixaFotos!: ElementRef<HTMLElement>;

  estaPerto(indice: number): boolean {
    const total = this.fotos.length;
    const distancia = Math.abs(indice - this.indiceGaleria());
    return Math.min(distancia, total - distancia) <= FOTOS_PRE_CARREGADAS;
  }

  miniatura(indice: number): string | null {
    return this.estaPerto(indice) ? `url(assets/album/web/${this.fotos[indice].file}-thumb.webp)` : null;
  }

  moverGaleria(direcao: number, evento?: Event) {
    evento?.preventDefault();
    const atual = this.indiceGaleria();
    const indice = (atual + direcao + this.fotos.length) % this.fotos.length;
    const voltouAoInicio =
      (atual === 0 && direcao < 0) ||
      (atual === this.fotos.length - 1 && direcao > 0);
    const animar = !voltouAoInicio && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const faixa = this.faixaFotos.nativeElement;
    faixa.scrollTo({
      left: indice * faixa.clientWidth,
      behavior: animar ? 'smooth' : 'instant',
    });
  }

  atualizarIndiceGaleria() {
    const faixa = this.faixaFotos.nativeElement;
    if (!faixa.clientWidth) return;
    const indice = Math.round(faixa.scrollLeft / faixa.clientWidth);
    this.indiceGaleria.set(Math.max(0, Math.min(this.fotos.length - 1, indice)));
  }

  @HostListener('window:resize')
  realinharGaleria() {
    const faixa = this.faixaFotos?.nativeElement;
    if (!faixa) return;

    const indice = this.indiceGaleria();
    requestAnimationFrame(() => faixa.scrollTo({ left: indice * faixa.clientWidth, behavior: 'instant' }));
  }
}
