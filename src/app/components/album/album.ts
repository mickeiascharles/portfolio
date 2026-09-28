import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
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
  @ViewChildren('cartaoFoto') cartoesFotos!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('viewer', { static: true }) viewer!: ElementRef<HTMLDialogElement>;

  moverGaleria(direcao: number, evento?: Event) {
    evento?.preventDefault();
    const indice = Math.max(0, Math.min(this.fotos.length - 1, this.indiceGaleria() + direcao));
    this.indiceGaleria.set(indice);
    const faixa = this.faixaFotos.nativeElement;
    const cartao = this.cartoesFotos.get(indice)?.nativeElement;
    if (!cartao) return;

    const esquerda =
      faixa.scrollLeft + cartao.getBoundingClientRect().left - faixa.getBoundingClientRect().left;
    faixa.scrollTo({
      left: esquerda,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  atualizarIndiceGaleria() {
    const faixa = this.faixaFotos.nativeElement;
    if (faixa.scrollLeft + faixa.clientWidth >= faixa.scrollWidth - 2) {
      this.indiceGaleria.set(this.fotos.length - 1);
      return;
    }

    const inicio = faixa.getBoundingClientRect().left;
    let indiceMaisProximo = 0;
    let menorDistancia = Infinity;
    this.cartoesFotos.forEach((cartao, indice) => {
      const distancia = Math.abs(cartao.nativeElement.getBoundingClientRect().left - inicio);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        indiceMaisProximo = indice;
      }
    });
    this.indiceGaleria.set(indiceMaisProximo);
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
