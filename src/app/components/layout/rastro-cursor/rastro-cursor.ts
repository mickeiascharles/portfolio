import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

/** Posição na grade, medida em células (não em pixels). */
type Celula = { coluna: number; linha: number };

const TAMANHO_CELULA = 10;
const LADO_QUADRADO = 8;
const QUANTIDADE_DE_QUADRADOS = 14;
/** Intervalo entre um passo e outro, para o movimento andar "de casa em casa". */
const INTERVALO_DO_PASSO = 22;
const MAXIMO_DE_PASSOS_POR_QUADRO = 4;
/** Quantas células a cabeça para antes do cursor, para não cobrir o que está sendo apontado. */
const FOLGA_DO_CURSOR = 2;

/**
 * Fila de quadradinhos pretos que segue o cursor andando pela grade, como um jogo de fliperama.
 * Quando o mouse para, a fila também para e continua desenhada na tela.
 */
@Component({
  selector: 'app-rastro-cursor',
  standalone: true,
  template: '<canvas #tela aria-hidden="true"></canvas>',
  styleUrl: './rastro-cursor.css',
})
export class RastroCursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tela', { static: true }) private tela!: ElementRef<HTMLCanvasElement>;

  private readonly zona = inject(NgZone);
  private contexto: CanvasRenderingContext2D | null = null;
  private consulta: MediaQueryList | null = null;
  private quadrados: Celula[] = [];
  private destino: Celula | null = null;
  private ultimoPasso = 0;
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
    } else {
      this.desativar();
    }
  };

  private desativar(): void {
    if (!this.ativo) return;
    this.ativo = false;
    window.removeEventListener('resize', this.ajustarTela);
    window.removeEventListener('pointermove', this.registrarMovimento);
    cancelAnimationFrame(this.animacao);
    this.animacao = 0;
    this.quadrados = [];
    this.destino = null;
    this.contexto?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private readonly ajustarTela = (): void => {
    if (!this.contexto) return;

    const escala = Math.min(window.devicePixelRatio || 1, 1.5);
    const canvas = this.tela.nativeElement;
    canvas.width = Math.ceil(window.innerWidth * escala);
    canvas.height = Math.ceil(window.innerHeight * escala);
    this.contexto.setTransform(escala, 0, 0, escala, 0, 0);
    this.desenharQuadrados();
  };

  private readonly registrarMovimento = (evento: PointerEvent): void => {
    if (evento.pointerType !== 'mouse') return;

    this.destino = {
      coluna: Math.floor(evento.clientX / TAMANHO_CELULA),
      linha: Math.floor(evento.clientY / TAMANHO_CELULA),
    };
    if (!this.quadrados.length) {
      this.quadrados = Array.from({ length: QUANTIDADE_DE_QUADRADOS }, () => ({ ...this.destino! }));
    }
    if (!this.animacao) this.animacao = requestAnimationFrame(this.animar);
  };

  private readonly animar = (agora: number): void => {
    this.animacao = 0;

    let andou = true;
    if (agora - this.ultimoPasso >= INTERVALO_DO_PASSO) {
      this.ultimoPasso = agora;
      // Longe do cursor a fila corre mais, para não ficar para trás em movimentos rápidos.
      for (let passo = 0; passo < this.passosPorQuadro(); passo++) andou = this.darUmPasso();
      this.desenharQuadrados();
    }

    // Chegando ao destino a animação para; o último quadro fica na tela.
    if (andou) this.animacao = requestAnimationFrame(this.animar);
  };

  private passosPorQuadro(): number {
    const cabeca = this.quadrados[0];
    if (!cabeca || !this.destino) return 1;
    const distancia =
      Math.abs(this.destino.coluna - cabeca.coluna) + Math.abs(this.destino.linha - cabeca.linha);
    return Math.min(Math.max(Math.ceil(distancia / 12), 1), MAXIMO_DE_PASSOS_POR_QUADRO);
  }

  /** Avança a cabeça uma célula em direção ao cursor e puxa o resto da fila atrás dela. */
  private darUmPasso(): boolean {
    const destino = this.destino;
    const cabeca = this.quadrados[0];
    if (!destino || !cabeca) return false;

    const dx = destino.coluna - cabeca.coluna;
    const dy = destino.linha - cabeca.linha;
    if (Math.max(Math.abs(dx), Math.abs(dy)) <= FOLGA_DO_CURSOR) return false;

    // Só anda na horizontal ou na vertical, nunca na diagonal.
    const novaCabeca =
      Math.abs(dx) >= Math.abs(dy)
        ? { coluna: cabeca.coluna + Math.sign(dx), linha: cabeca.linha }
        : { coluna: cabeca.coluna, linha: cabeca.linha + Math.sign(dy) };

    this.quadrados.unshift(novaCabeca);
    this.quadrados.pop();
    return true;
  }

  private desenharQuadrados(): void {
    const contexto = this.contexto;
    if (!contexto) return;

    contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
    contexto.fillStyle = '#000';
    const margem = (TAMANHO_CELULA - LADO_QUADRADO) / 2;
    for (const quadrado of this.quadrados) {
      contexto.fillRect(
        quadrado.coluna * TAMANHO_CELULA + margem,
        quadrado.linha * TAMANHO_CELULA + margem,
        LADO_QUADRADO,
        LADO_QUADRADO,
      );
    }
  }
}
