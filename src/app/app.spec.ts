import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
  });

  it('cria a aplicação', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('mostra a estrutura do portfólio', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.layout-frame')).toBeTruthy();
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-rastro-cursor canvas')).toBeTruthy();
  });

  it('remove a abertura após a animação da assinatura', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const abertura = fixture.nativeElement.querySelector('.intro-overlay') as HTMLElement;

    abertura.dispatchEvent(new AnimationEvent('animationend', {
      bubbles: true,
      animationName: 'sumirAbertura',
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.intro-overlay')).toBeNull();
  });
});
