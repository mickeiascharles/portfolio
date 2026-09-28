import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../services/language';
import { albumPhotos } from './photos';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.html',
  styleUrl: './album.css',
})
export class AlbumComponent {
  readonly language = inject(LanguageService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly photos = albumPhotos;
  readonly selectedIndex = signal<number | null>(null);
  readonly activePhoto = computed(() => {
    const index = this.selectedIndex();
    return index === null ? null : this.photos[index];
  });

  @ViewChild('viewer', { static: true }) viewer!: ElementRef<HTMLDialogElement>;

  openPhoto(index: number) {
    this.selectedIndex.set(index);
    this.cdr.detectChanges();
    this.viewer.nativeElement.showModal();
  }

  closePhoto() {
    this.viewer.nativeElement.close();
  }

  navigate(direction: number, event?: Event) {
    event?.preventDefault();
    const index = this.selectedIndex();
    if (index !== null) {
      this.selectedIndex.set((index + direction + this.photos.length) % this.photos.length);
    }
  }

  closeOnBackdrop(event: MouseEvent) {
    if (event.target === this.viewer.nativeElement) this.closePhoto();
  }
}
