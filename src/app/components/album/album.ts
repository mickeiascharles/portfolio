import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../services/language';
import { albumPhotos } from './photos';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.html',
  styleUrl: './album.css',
})
export class AlbumComponent {
  readonly language = inject(LanguageService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly fotos = albumPhotos;
  readonly indiceGaleria = signal(0);
  readonly indiceSelecionado = signal<number | null>(null);
  private inicioDeslize: { x: number; y: number } | null = null;
  readonly fotoAtiva = computed(() => {
    const indice = this.indiceSelecionado();
    return indice === null ? null : this.fotos[indice];
  });

  @ViewChild('faixaFotos') faixaFotos!: ElementRef<HTMLElement>;
  @ViewChild('viewer', { static: true }) viewer!: ElementRef<HTMLDialogElement>;

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

  abrirFoto(indice: number) {
    this.indiceSelecionado.set(indice);
    this.cdr.detectChanges();
    this.viewer.nativeElement.showModal();
  }

  fecharFoto() {
    this.viewer.nativeElement.close();
  }

  navegarFoto(direcao: number, evento?: Event) {
    evento?.preventDefault();
    const indice = this.indiceSelecionado();
    if (indice !== null) {
      this.indiceSelecionado.set((indice + direcao + this.fotos.length) % this.fotos.length);
    }
  }

  iniciarDeslize(evento: TouchEvent) {
    const toque = evento.touches.length === 1 ? evento.touches[0] : null;
    this.inicioDeslize = toque ? { x: toque.clientX, y: toque.clientY } : null;
  }

  encerrarDeslize(evento: TouchEvent) {
    const inicio = this.inicioDeslize;
    this.inicioDeslize = null;
    if (!inicio || evento.changedTouches.length !== 1) return;

    const toque = evento.changedTouches[0];
    const distanciaX = toque.clientX - inicio.x;
    const distanciaY = toque.clientY - inicio.y;

    if (Math.abs(distanciaX) > 60 && Math.abs(distanciaX) > Math.abs(distanciaY) * 1.2) {
      this.navegarFoto(distanciaX < 0 ? 1 : -1);
    } else if (distanciaY > 90 && distanciaY > Math.abs(distanciaX) * 1.2) {
      this.fecharFoto();
    }
  }

  fecharAoClicarFora(evento: MouseEvent) {
    if (evento.target === this.viewer.nativeElement) this.fecharFoto();
  }
}
