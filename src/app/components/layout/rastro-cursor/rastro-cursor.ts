import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

/** Célula da grade acesa pelo cursor, como um pixel de tela antiga. */
type Celula = { coluna: number; linha: number; acesaEm: number };

const TAMANHO_CELULA = 8;
const ESPACO_ENTRE_CELULAS = 1;
const DURACAO_CELULA = 420;
const DEGRAUS_DE_OPACIDADE = 4;
const LIMITE_CELULAS = 90;
const CHANCE_DE_PIXEL_VIZINHO = 0.35;
const SALTO_MAXIMO = 160;

@Component({
  selector: 'app-rastro-cursor',
  standalone: true,
  template: '<canvas #tela aria-hidden="true"></canvas>',
  styleUrl: './rastro-cursor.css',
})
export class RastroCursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tela', { static: true }) private tela!: ElementRef<HTMLCanvasElement>;

  private readonly zona = inject(NgZone);
  private readonly celulas = new Map<string, Celula>();
  private contexto: CanvasRenderingContext2D | null = null;
  private consulta: MediaQueryList | null = null;
  private ultimaPosicao: { coluna: number; linha: number } | null = null;
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
    this.limpar();
  }

  private readonly ajustarTela = (): void => {
    if (!this.contexto) return;

    const escala = Math.min(window.devicePixelRatio || 1, 1.5);
    const canvas = this.tela.nativeElement;
    canvas.width = Math.ceil(window.innerWidth * escala);
    canvas.height = Math.ceil(window.innerHeight * escala);
    this.contexto.setTransform(escala, 0, 0, escala, 0, 0);
    this.limpar();
  };

  private readonly limparSeOculta = (): void => {
    if (document.hidden) this.limpar();
  };

  private limpar(): void {
    this.celulas.clear();
    this.ultimaPosicao = null;
    this.contexto?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private readonly registrarMovimento = (evento: PointerEvent): void => {
    if (evento.pointerType !== 'mouse') return;

    const atual = {
      coluna: Math.floor(evento.clientX / TAMANHO_CELULA),
      linha: Math.floor(evento.clientY / TAMANHO_CELULA),
    };
    const anterior = this.ultimaPosicao ?? atual;
    const passos = Math.max(
      Math.abs(atual.coluna - anterior.coluna),
      Math.abs(atual.linha - anterior.linha),
    );
    if (this.ultimaPosicao && passos === 0) return;

    // Um salto grande (mouse saindo e voltando da janela) não deve riscar a tela inteira.
    const agora = performance.now();
    if (passos * TAMANHO_CELULA > SALTO_MAXIMO) {
      this.acenderCelula(atual.coluna, atual.linha, agora);
    } else {
      // Preenche as células entre as duas posições para o rastro não ficar com buracos.
      for (let passo = 1; passo <= Math.max(passos, 1); passo++) {
        const progresso = passo / Math.max(passos, 1);
        const coluna = Math.round(anterior.coluna + (atual.coluna - anterior.coluna) * progresso);
        const linha = Math.round(anterior.linha + (atual.linha - anterior.linha) * progresso);
        this.acenderCelula(coluna, linha, agora);
      }
    }

    this.ultimaPosicao = atual;
    if (!this.animacao) this.animacao = requestAnimationFrame(this.desenhar);
  };

  private acenderCelula(coluna: number, linha: number, agora: number): void {
    this.guardarCelula(coluna, linha, agora);

    // Um pixel vizinho aceso de vez em quando dá o aspecto de ruído digital.
    if (Math.random() < CHANCE_DE_PIXEL_VIZINHO) {
      const deslocamentos = [-1, 1];
      const vizinhoNaColuna = Math.random() < 0.5;
      const deslocamento = deslocamentos[Math.floor(Math.random() * 2)];
      this.guardarCelula(
        coluna + (vizinhoNaColuna ? deslocamento : 0),
        linha + (vizinhoNaColuna ? 0 : deslocamento),
        agora - DURACAO_CELULA * 0.4,
      );
    }
  }

  private guardarCelula(coluna: number, linha: number, acesaEm: number): void {
    const chave = `${coluna},${linha}`;
    this.celulas.delete(chave);
    this.celulas.set(chave, { coluna, linha, acesaEm });

    // O Map preserva a ordem de inserção, então a primeira chave é sempre a mais antiga.
    if (this.celulas.size > LIMITE_CELULAS) {
      this.celulas.delete(this.celulas.keys().next().value!);
    }
  }

  private readonly desenhar = (agora: number): void => {
    this.animacao = 0;
    const contexto = this.contexto;
    if (!contexto) return;

    contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
    contexto.fillStyle = '#000';
    const lado = TAMANHO_CELULA - ESPACO_ENTRE_CELULAS;

    for (const [chave, celula] of this.celulas) {
      const restante = 1 - (agora - celula.acesaEm) / DURACAO_CELULA;
      if (restante <= 0) {
        this.celulas.delete(chave);
        continue;
      }

      // A opacidade cai em degraus, sem gradiente suave, como um monitor de fósforo.
      contexto.globalAlpha =
        (Math.ceil(restante * DEGRAUS_DE_OPACIDADE) / DEGRAUS_DE_OPACIDADE) * 0.85;
      contexto.fillRect(celula.coluna * TAMANHO_CELULA, celula.linha * TAMANHO_CELULA, lado, lado);
    }

    contexto.globalAlpha = 1;
    if (this.celulas.size) this.animacao = requestAnimationFrame(this.desenhar);
  };
}
