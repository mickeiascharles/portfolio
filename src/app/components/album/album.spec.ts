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
  });

  it('move apenas a faixa da galeria e respeita os limites', () => {
    const fixture = TestBed.createComponent(AlbumComponent);
    fixture.detectChanges();
    const componente = fixture.componentInstance;
    const faixa = fixture.nativeElement.querySelector('.photo-strip') as HTMLElement;
    const rolar = spyOn(faixa, 'scrollTo');

    componente.moverGaleria(1);
    expect(componente.indiceGaleria()).toBe(1);
    expect(rolar).toHaveBeenCalled();

    componente.indiceGaleria.set(14);
    componente.moverGaleria(1);
    expect(componente.indiceGaleria()).toBe(14);
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
});
