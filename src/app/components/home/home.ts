import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  readonly language = inject(LanguageService);

  isTerminalOpen = false;
  displayedLines: { text: string; cssClass: string }[] = [];
  private typingTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  openTerminal() {
    this.isTerminalOpen = true;
    this.displayedLines = [];
    this.startTypingEffect(0);
  }

  closeTerminal() {
    this.isTerminalOpen = false;
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  startTypingEffect(lineIndex: number) {
    const terminalLines = this.language.text().home.terminalLines;

    if (lineIndex >= terminalLines.length) return;

    const lineData = terminalLines[lineIndex];

    this.displayedLines.push({ text: '', cssClass: lineData.cssClass });

    this.cdr.detectChanges();

    if (lineIndex === terminalLines.length - 1) {
      this.displayedLines[lineIndex].text = lineData.text;
      this.cdr.detectChanges();
      return;
    }

    this.typeLineChars(lineIndex, lineData.text, 0);
  }

  typeLineChars(lineIndex: number, fullText: string, charIndex: number) {
    if (!this.isTerminalOpen) return;

    if (charIndex < fullText.length) {
      this.displayedLines[lineIndex].text += fullText.charAt(charIndex);

      this.cdr.detectChanges();

      this.typingTimeout = setTimeout(() => {
        this.typeLineChars(lineIndex, fullText, charIndex + 1);
      }, 3);
    } else {
      this.typingTimeout = setTimeout(() => {
        this.startTypingEffect(lineIndex + 1);
      }, 20);
    }
  }
}
