import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  isTerminalOpen = false;
  displayedLines: { text: string; cssClass: string }[] = [];
  private typingTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  fullTerminalData = [
    {
      text: 'C:\\Users\\Mickeias\\Dev> gcc Historia_Mickeias.c',
      cssClass: 'cmd-line',
    },
    { text: ' ', cssClass: '' },
    { text: '========================================', cssClass: '' },
    { text: 'Nome: Mickeias Charles de Oliveira Paiva', cssClass: '' },
    { text: 'Nascimento: 03/10/2001 - Brasília, Brasil', cssClass: '' },
    { text: '========================================', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: 'Gostos favoritos:', cssClass: '' },
    { text: ' - GTA San Andreas (Jogo)', cssClass: '' },
    { text: ' - Elden Ring (Jogo)', cssClass: '' },
    { text: " - Assassin's Creed: Valhalla (Jogo)", cssClass: '' },
    { text: ' - Harry Potter (Filme)', cssClass: '' },
    { text: ' - Game of Thrones & House of the Dragon (Série)', cssClass: '' },
    { text: ' - Stranger Things (Série)', cssClass: '' },
    { text: ' - Breaking Bad (Série)', cssClass: '' },
    { text: ' - Silicon Valley (Série)', cssClass: '' },
    { text: ' - Vikings (Série)', cssClass: '' },
    { text: ' - O Alquimista (Livro)', cssClass: '' },
    { text: ' - A Sutil arte de ligar o F*da-se (Livro)', cssClass: '' },
    { text: ' - Código Limpo (Livro)', cssClass: '' },
    { text: ' - HomoDeus (Livro)', cssClass: '' },
    { text: '------------', cssClass: '' },
    { text: 'Ídolos e inspirações:', cssClass: '' },
    { text: ' - Travis Scott (Artista)', cssClass: '' },
    { text: ' - Djavan (Cantor e Compositor)', cssClass: '' },
    { text: ' - Alan Turing (Pai da Computação)', cssClass: '' },
    { text: ' - George R.R. Martin (Escritor)', cssClass: '' },
    { text: ' - Machado de Assis (Escritor)', cssClass: '' },
    { text: ' - Hideo Kojima (Diretor de Games)', cssClass: '' },
    { text: ' - Hidetaka Miyazaki (Diretor de Games)', cssClass: '' },
    { text: '------------', cssClass: '' },
    { text: 'Linha do tempo (eventos registrados):', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[03/10/2001] Nascimento', cssClass: '' },
    { text: '   Nascimento em Brasília.', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[00/00/2008] Interesse por tecnologia e jogos', cssClass: '' },
    { text: '   Infância marcada por curiosidade; GTA e AC formaram gosto.', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[06/11/2022] Fez Auto-Escola', cssClass: '' },
    { text: '   Tirou Habilitaçao.', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[06/11/2022] Fãs e shows de Travis Scott', cssClass: '' },
    { text: '   Primavera Sound (SP) e Rock in Rio.', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[00/08/2024] Entrada na faculdade de Ciência da Computação', cssClass: '' },
    { text: '   Início de projetos práticos vendo código como arte.', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[00/00/2024] Projeto: ListBeat', cssClass: '' },
    { text: '   App inspirado no Letterboxd para música (SwiftUI).', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[00/00/2024] Projeto: Rolê', cssClass: '' },
    { text: '   Rede social cultural (Projeto Acadêmico).', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[00/00/2024] Trabalhos e estudos em diversas tecnologias', cssClass: '' },
    { text: '   Exp: Swift, Java, JS, C, HTML, CSS, TS, SQL, Web Dev.', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: '[00/00/2024] Projeto: Hubbies', cssClass: '' },
    { text: '   Plataforma de conexão universitária e portfólio.', cssClass: '' },
    { text: '------------', cssClass: '' },
    { text: 'ACOMPANHE PARA AS MINHAS PRÓXIMAS AVENTURAS.', cssClass: '' },
    { text: ' ', cssClass: '' },
    { text: 'C:\\Users\\Mickeias\\Dev> _', cssClass: 'cmd-line blink' },
  ];

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
    if (lineIndex >= this.fullTerminalData.length) return;

    const lineData = this.fullTerminalData[lineIndex];

    this.displayedLines.push({ text: '', cssClass: lineData.cssClass });

    this.cdr.detectChanges();

    if (lineIndex === this.fullTerminalData.length - 1) {
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
