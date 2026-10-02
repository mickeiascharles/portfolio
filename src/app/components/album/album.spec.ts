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

    expect(pagina.querySelectorAll('.photo-item').length).toBe(18);
    expect(pagina.querySelector('figcaption')).toBeNull();
    expect(pagina.querySelector('dialog')).toBeNull();
    expect(pagina.querySelector('.photo-item button')).toBeNull();
    expect(pagina.querySelectorAll('.photo-item:not([inert])').length).toBe(1);
    expect(fixture.componentInstance.fotos.slice(0, 4).map((foto) => foto.file)).toEqual([
      'Estudando_em_casa', 'Google', 'IINFRA2', 'abertura_aws_eu',
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

    componente.indiceGaleria.set(17);
    componente.moverGaleria(1);
    expect(rolar.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ left: 0 }));
    componente.indiceGaleria.set(0);
    componente.moverGaleria(-1);
    expect(rolar.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ left: 6800 }));
  });
});
