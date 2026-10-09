import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SomService {
  tocar(arquivo: string, volume: number) {
    const audio = new Audio(`assets/${arquivo}`);
    audio.volume = volume;
    audio.play().catch((err) => console.warn(err));
  }
}
