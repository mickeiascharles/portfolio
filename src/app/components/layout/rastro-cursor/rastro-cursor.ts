import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

type Marca = { x: number; y: number; criadaEm: number };

const DURACAO_MARCA = 430;
const DISTANCIA_MINIMA = 11;
const LIMITE_MARCAS = 16;

@Component({
  selector: 'app-rastro-cursor',
  standalone: true,
  template: '<canvas #tela aria-hidden="true"></canvas>',
  styleUrl: './rastro-cursor.css',
})
export class RastroCursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tela', { static: true }) private tela!: ElementRef<HTMLCanvasElement>;

  private readonly zona = inject(NgZone);
  private readonly marcas: Marca[] = [];
  private contexto: CanvasRenderingContext2D | null = null;
  private consulta: MediaQueryList | null = null;
  private animacao = 0;
  private ativo = false;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.contexto = this.tela.nativeElement.getContext('2d');
    if (!this.contexto) return;

    this.zona.runOutsideAngular(() => {
      this.consulta = window.matchMedia(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      );
      this.consulta.addEventListener('change', this.atualizarAtivacao);
      this.atualizarAtivacao();
    });
  }

  ngOnDestroy(): void {
    this.consulta?.removeEventListener('change', this.atualizarAtivacao);
    this.desativar();
  }

  private readonly atualizarAtivacao = (): void => {
    if (this.consulta?.matches) {
      if (this.ativo) return;
      this.ativo = true;
      this.ajustarTela();
      window.addEventListener('resize', this.ajustarTela);
      window.addEventListener('pointermove', this.registrarMovimento, { passive: true });
      document.addEventListener('visibilitychange', this.limparSeOculta);
    } else {
      this.desativar();
    }
  };

  private desativar(): void {
    if (!this.ativo) return;
    this.ativo = false;
    window.removeEventListener('resize', this.ajustarTela);
    window.removeEventListener('pointermove', this.registrarMovimento);
    document.removeEventListener('visibilitychange', this.limparSeOculta);
    cancelAnimationFrame(this.animacao);
    this.animacao = 0;
    this.marcas.length = 0;
    this.contexto?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private readonly ajustarTela = (): void => {
    if (!this.contexto) return;

    const escala = Math.min(window.devicePixelRatio || 1, 1.5);
    const canvas = this.tela.nativeElement;
    canvas.width = Math.ceil(window.innerWidth * escala);
    canvas.height = Math.ceil(window.innerHeight * escala);
    this.contexto.setTransform(escala, 0, 0, escala, 0, 0);
    this.marcas.length = 0;
  };

  private readonly limparSeOculta = (): void => {
    if (document.hidden) {
      this.marcas.length = 0;
      this.contexto?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  private readonly registrarMovimento = (evento: PointerEvent): void => {
    if (evento.pointerType !== 'mouse') return;

    const anterior = this.marcas[this.marcas.length - 1];
    if (anterior) {
      const distancia = Math.hypot(evento.clientX - anterior.x, evento.clientY - anterior.y);
      if (distancia < DISTANCIA_MINIMA) return;
      if (distancia > 140) this.marcas.length = 0;
    }

    this.marcas.push({ x: evento.clientX, y: evento.clientY, criadaEm: performance.now() });
    if (this.marcas.length > LIMITE_MARCAS) this.marcas.shift();
    if (!this.animacao) this.animacao = requestAnimationFrame(this.desenhar);
  };

  private readonly desenhar = (agora: number): void => {
    this.animacao = 0;
    const contexto = this.contexto;
    if (!contexto) return;

    contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
    while (this.marcas.length && agora - this.marcas[0].criadaEm >= DURACAO_MARCA) {
      this.marcas.shift();
    }

    for (const marca of this.marcas) {
      const intensidade = 1 - (agora - marca.criadaEm) / DURACAO_MARCA;
      const largura = 3 + 4 * intensidade;
      const altura = 5 + 8 * intensidade;
      contexto.fillStyle = `rgba(0, 0, 0, ${0.9 * intensidade})`;
      contexto.fillRect(marca.x - largura / 2, marca.y - altura / 2, largura, altura);
    }

    if (this.marcas.length) this.animacao = requestAnimationFrame(this.desenhar);
  };
}
