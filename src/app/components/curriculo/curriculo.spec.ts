import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculoComponent } from './curriculo';

describe('CurriculoComponent', () => {
  let component: CurriculoComponent;
  let fixture: ComponentFixture<CurriculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculoComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
