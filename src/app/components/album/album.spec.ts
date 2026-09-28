import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlbumComponent } from './album';

describe('AlbumComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('mostra as fotos sem legendas visíveis', () => {
    const fixture = TestBed.createComponent(AlbumComponent);
    fixture.detectChanges();
    const pagina = fixture.nativeElement as HTMLElement;

    expect(pagina.querySelectorAll('.photo-item').length).toBe(15);
    expect(pagina.querySelector('figcaption')).toBeNull();
    expect(pagina.querySelectorAll('.photo-item:not([inert])').length).toBe(1);
    expect(fixture.componentInstance.fotos.slice(0, 3).map((foto) => foto.file)).toEqual([
      'Estudando_em_casa', 'Google', 'IINFRA2',
    ]);
  });

  it('move apenas a faixa da galeria e respeita os limites', () => {
    const fixture = TestBed.createComponent(AlbumComponent);
    fixture.detectChanges();
    const componente = fixture.componentInstance;
    const faixa = fixture.nativeElement.querySelector('.photo-strip') as HTMLElement;
    const rolar = spyOn(faixa, 'scrollTo');
    spyOnProperty(faixa, 'clientWidth').and.returnValue(400);

    componente.moverGaleria(1);
    expect(rolar.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ left: 400 }));
    spyOnProperty(faixa, 'scrollLeft').and.returnValue(400);
    componente.atualizarIndiceGaleria();
    expect(componente.indiceGaleria()).toBe(1);

    componente.indiceGaleria.set(14);
    componente.moverGaleria(1);
    expect(rolar.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ left: 0 }));
    componente.indiceGaleria.set(0);
    componente.moverGaleria(-1);
    expect(rolar.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ left: 5600 }));
  });

  it('abre a foto inteira e fecha o visualizador', () => {
    const fixture = TestBed.createComponent(AlbumComponent);
    fixture.detectChanges();
    const componente = fixture.componentInstance;
    const visualizador = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;

    componente.abrirFoto(0);
    expect(visualizador.open).toBeTrue();
    expect(visualizador.querySelector('.viewer-photo-frame img')).toBeTruthy();
    expect(visualizador.querySelector('#photo-caption')).toBeNull();

    componente.fecharFoto();
    expect(visualizador.open).toBeFalse();
  });

  it('navega com deslizes laterais e fecha com deslize para baixo', () => {
    const fixture = TestBed.createComponent(AlbumComponent);
    fixture.detectChanges();
    const componente = fixture.componentInstance;
    const visualizador = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;

    const deslizar = (inicioX: number, inicioY: number, fimX: number, fimY: number) => {
      const tocar = (tipo: 'touchstart' | 'touchend', x: number, y: number) => {
        const toque = new Touch({ identifier: 1, target: visualizador, clientX: x, clientY: y });
        visualizador.dispatchEvent(new TouchEvent(tipo, {
          bubbles: true,
          touches: tipo === 'touchstart' ? [toque] : [],
          changedTouches: [toque],
        }));
      };
      tocar('touchstart', inicioX, inicioY);
      tocar('touchend', fimX, fimY);
    };

    componente.abrirFoto(0);
    deslizar(280, 300, 100, 300);
    expect(componente.indiceSelecionado()).toBe(1);
    deslizar(100, 300, 280, 300);
    expect(componente.indiceSelecionado()).toBe(0);
    deslizar(180, 250, 180, 390);
    expect(visualizador.open).toBeFalse();
  });
});
