import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreComponent } from './sobre';

describe('SobreComponent', () => {
  let component: SobreComponent;
  let fixture: ComponentFixture<SobreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exibe as logos de COBOL e Assembly', () => {
    const pagina = fixture.nativeElement as HTMLElement;

    expect(pagina.querySelector('img[alt="COBOL"]')?.getAttribute('src')).toBe('assets/icons/cobol.svg');
    expect(pagina.querySelector('img[alt="Assembly"]')?.getAttribute('src')).toBe('assets/icons/assembly.svg');
  });
});
