import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

type Ponto = { x: number; y: number };
type Direcao = 'direita' | 'esquerda' | 'cima' | 'baixo';

/** Tamanho de cada "pixel" do desenho, para manter o visual de jogo antigo. */
const PIXEL = 3;
/** Raio do Pac-Man medido em pixels do desenho. */
const RAIO_PACMAN = 7;
/** Distância que o Pac-Man mantém do cursor para não cobrir o que está sendo apontado. */
const DISTANCIA_DO_CURSOR = 30;
const SUAVIDADE_PERSEGUICAO = 0.16;
const ESPACO_ENTRE_PASTILHAS = 18;
const TAMANHO_PASTILHA = 4;
const LIMITE_PASTILHAS = 70;
const ABERTURA_MAXIMA_BOCA = Math.PI / 4;
const VELOCIDADE_MASTIGADA = 0.012;

const ANGULO_DA_DIRECAO: Record<Direcao, number> = {
  direita: 0,
  baixo: Math.PI / 2,
  esquerda: Math.PI,
  cima: -Math.PI / 2,
};

/**
 * Pac-Man em pixel art que persegue o cursor e come as pastilhas deixadas pelo caminho.
 * Fica parado na tela quando o mouse para; só anima enquanto há movimento.
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
  private readonly pastilhas: Ponto[] = [];
  private contexto: CanvasRenderingContext2D | null = null;
  private consulta: MediaQueryList | null = null;
  private pacman: Ponto | null = null;
  private cursor: Ponto | null = null;
  private ultimaPastilha: Ponto | null = null;
  private direcao: Direcao = 'direita';
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
    this.pastilhas.length = 0;
    this.pacman = this.cursor = this.ultimaPastilha = null;
    this.contexto?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private readonly ajustarTela = (): void => {
    if (!this.contexto) return;

    const escala = Math.min(window.devicePixelRatio || 1, 1.5);
    const canvas = this.tela.nativeElement;
    canvas.width = Math.ceil(window.innerWidth * escala);
    canvas.height = Math.ceil(window.innerHeight * escala);
    this.contexto.setTransform(escala, 0, 0, escala, 0, 0);
    this.contexto.imageSmoothingEnabled = false;
    this.pedirQuadro();
  };

  private readonly registrarMovimento = (evento: PointerEvent): void => {
    if (evento.pointerType !== 'mouse') return;

    this.cursor = { x: evento.clientX, y: evento.clientY };
    this.pacman ??= { ...this.cursor };
    this.soltarPastilhas(this.cursor);
    this.pedirQuadro();
  };

  /** Deixa pastilhas espaçadas ao longo do caminho percorrido pelo cursor. */
  private soltarPastilhas(cursor: Ponto): void {
    const anterior = this.ultimaPastilha;
    if (!anterior) {
      this.ultimaPastilha = cursor;
      return;
    }

    const distancia = Math.hypot(cursor.x - anterior.x, cursor.y - anterior.y);
    const quantidade = Math.floor(distancia / ESPACO_ENTRE_PASTILHAS);
    for (let i = 1; i <= quantidade; i++) {
      const progresso = (i * ESPACO_ENTRE_PASTILHAS) / distancia;
      this.pastilhas.push({
        x: anterior.x + (cursor.x - anterior.x) * progresso,
        y: anterior.y + (cursor.y - anterior.y) * progresso,
      });
    }
    if (quantidade) this.ultimaPastilha = this.pastilhas[this.pastilhas.length - 1];
    if (this.pastilhas.length > LIMITE_PASTILHAS) {
      this.pastilhas.splice(0, this.pastilhas.length - LIMITE_PASTILHAS);
    }
  }

  private pedirQuadro(): void {
    if (!this.animacao) this.animacao = requestAnimationFrame(this.desenhar);
  }

  private readonly desenhar = (agora: number): void => {
    this.animacao = 0;
    const contexto = this.contexto;
    const pacman = this.pacman;
    const cursor = this.cursor;
    if (!contexto || !pacman || !cursor) return;

    const emMovimento = this.perseguirCursor(pacman, cursor);
    this.comerPastilhas(pacman);

    contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
    contexto.fillStyle = '#000';
    for (const pastilha of this.pastilhas) {
      contexto.fillRect(
        Math.round(pastilha.x - TAMANHO_PASTILHA / 2),
        Math.round(pastilha.y - TAMANHO_PASTILHA / 2),
        TAMANHO_PASTILHA,
        TAMANHO_PASTILHA,
      );
    }

    // A boca abre e fecha enquanto anda; parado, fica entreaberta esperando o cursor.
    const abertura = emMovimento
      ? Math.abs(Math.sin(agora * VELOCIDADE_MASTIGADA)) * ABERTURA_MAXIMA_BOCA
      : ABERTURA_MAXIMA_BOCA / 2;
    this.desenharPacman(contexto, pacman, abertura);

    // Parado, o último quadro continua na tela sem gastar processamento.
    if (emMovimento) this.pedirQuadro();
  };

  /** Move o Pac-Man em direção ao cursor e devolve se ele ainda está andando. */
  private perseguirCursor(pacman: Ponto, cursor: Ponto): boolean {
    const dx = cursor.x - pacman.x;
    const dy = cursor.y - pacman.y;
    const distancia = Math.hypot(dx, dy);
    const restante = distancia - DISTANCIA_DO_CURSOR;
    if (restante <= 0.5) return false;

    const passo = Math.max(restante * SUAVIDADE_PERSEGUICAO, 1);
    pacman.x += (dx / distancia) * passo;
    pacman.y += (dy / distancia) * passo;

    // Como no fliperama, ele só olha para quatro direções.
    this.direcao =
      Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'direita' : 'esquerda') : dy > 0 ? 'baixo' : 'cima';
    return true;
  }

  private comerPastilhas(pacman: Ponto): void {
    const alcance = RAIO_PACMAN * PIXEL;
    for (let i = this.pastilhas.length - 1; i >= 0; i--) {
      const pastilha = this.pastilhas[i];
      if (Math.hypot(pastilha.x - pacman.x, pastilha.y - pacman.y) <= alcance) {
        this.pastilhas.splice(i, 1);
      }
    }
  }

  /** Desenha o Pac-Man célula por célula, o que dá o contorno serrilhado de pixel art. */
  private desenharPacman(
    contexto: CanvasRenderingContext2D,
    centro: Ponto,
    aberturaBoca: number,
  ): void {
    const anguloBoca = ANGULO_DA_DIRECAO[this.direcao];
    const origemX = Math.round(centro.x / PIXEL) * PIXEL;
    const origemY = Math.round(centro.y / PIXEL) * PIXEL;

    for (let linha = -RAIO_PACMAN; linha < RAIO_PACMAN; linha++) {
      for (let coluna = -RAIO_PACMAN; coluna < RAIO_PACMAN; coluna++) {
        const x = coluna + 0.5;
        const y = linha + 0.5;
        if (x * x + y * y > RAIO_PACMAN * RAIO_PACMAN) continue;

        const diferenca = Math.atan2(y, x) - anguloBoca;
        const anguloAteBoca = Math.abs(Math.atan2(Math.sin(diferenca), Math.cos(diferenca)));
        if (anguloAteBoca < aberturaBoca) continue;

        contexto.fillRect(origemX + coluna * PIXEL, origemY + linha * PIXEL, PIXEL, PIXEL);
      }
    }
  }
}
