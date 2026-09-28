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
  readonly fotoAtiva = computed(() => {
    const indice = this.indiceSelecionado();
    return indice === null ? null : this.fotos[indice];
  });

  @ViewChild('faixaFotos') faixaFotos!: ElementRef<HTMLElement>;
  @ViewChild('viewer', { static: true }) viewer!: ElementRef<HTMLDialogElement>;

  moverGaleria(direcao: number, evento?: Event) {
    evento?.preventDefault();
    const indice = Math.max(0, Math.min(this.fotos.length - 1, this.indiceGaleria() + direcao));
    const faixa = this.faixaFotos.nativeElement;
    faixa.scrollTo({
      left: indice * faixa.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
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

  fecharAoClicarFora(evento: MouseEvent) {
    if (evento.target === this.viewer.nativeElement) this.fecharFoto();
  }
}
