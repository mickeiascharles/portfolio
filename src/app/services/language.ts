import { computed, effect, Injectable, signal } from '@angular/core';

export type LanguageCode = 'pt' | 'en';

type TerminalLine = {
  text: string;
  cssClass: string;
};

type ProjectLink = {
  href: string;
  iconClass: string;
  label: string;
};

type ProjectItem = {
  title: string;
  description: string;
  links: ProjectLink[];
};

type ToolItem = {
  src: string;
  alt: string;
};

type HobbyItem = {
  description: string;
  image: string;
  alt: string;
  toolsLabel: string;
  tools: ToolItem[];
};

type SiteCopy = {
  common: {
    copyright: string;
    languageSwitcherLabel: string;
    menuButtonLabel: string;
    portuguese: string;
    english: string;
    signatureAlt: string;
  };
  nav: {
    role: string;
    menuItems: Array<{ label: string; route: string }>;
  };
  home: {
    runButton: string;
    runButtonTitle: string;
    characterAlt: string;
    terminalTitle: string;
    codeSample: string;
    terminalLines: TerminalLine[];
  };
  about: {
    profileAlt: string;
    paragraphs: string[];
    languagesTitle: string;
    toolsTitle: string;
  };
  projects: {
    sideImageAlt: string;
    items: ProjectItem[];
  };
  hobbies: {
    title: string;
    backgroundAlt: string;
    items: HobbyItem[];
  };
  resume: {
    downloadLead: string;
    downloadRest: string;
    downloadFileName: string;
    pageOneAlt: string;
    pageTwoAlt: string;
  };
};

const repositoryLink = (label: string, href: string): ProjectLink => ({
  href,
  label,
  iconClass: 'bi bi-github',
});

const hostingLink = (label: string, href: string): ProjectLink => ({
  href,
  label,
  iconClass: 'bi bi-house-door-fill',
});

const illustrator: ToolItem = {
  src: 'assets/icons/illustrator.svg',
  alt: 'Illustrator',
};

const figma: ToolItem = {
  src: 'assets/icons/figma.svg',
  alt: 'Figma',
};

const translations: Record<LanguageCode, SiteCopy> = {
  pt: {
    common: {
      copyright: 'Copyright©, Todos os direitos reservados.',
      languageSwitcherLabel: 'Selecionar idioma',
      menuButtonLabel: 'Abrir menu de navegação',
      portuguese: 'Português',
      english: 'Inglês',
      signatureAlt: 'Assinatura',
    },
    nav: {
      role: 'Software Developer',
      menuItems: [
        { label: 'Projetos', route: '/projetos' },
        { label: 'Hobbies', route: '/hobbies' },
        { label: 'Sobre mim', route: '/sobre' },
        { label: 'Currículo PDF', route: '/curriculo' },
      ],
    },
    home: {
      runButton: 'Compilar / Rodar',
      runButtonTitle: 'Compilar e rodar',
      characterAlt: 'Ilustração Mickeias',
      terminalTitle: 'Terminal - ./Historia_Mickeias.c',
      codeSample: String.raw`/*
  Historia_Mickeias.c
  Um programa em C que representa a história de vida do desenvolvedor (Mickeias).
*/

#include <stdio.h>
#include <stdlib.h>
#include <locale.h>

typedef struct {
    int day;
    int month;
    int year;
} Date;

typedef struct {
    const char *title;
    const char *description;
    Date date;
} Event;

typedef struct {
    const char *name;
    Date birthdate;
    const char *birthplace;
    const char *favorites[20];
    int favorites_count;
    const char *idols[20];
    int idols_count;
    Event timeline[32];
    int timeline_count;
} Person;

void printDate(Date d) {
    if (d.day == 0 && d.month == 0 && d.year == 0) printf("(data desconhecida)");
    else printf("%02d/%02d/%04d", d.day, d.month, d.year);
}

void printHeader(const Person *p) {
    printf("========================================\n");
    printf("Nome: %s\n", p->name);
    printf("Nascimento: "); printDate(p->birthdate); printf(" - %s\n", p->birthplace);
    printf("========================================\n\n");
}

void printFavorites(const Person *p) {
    printf("Gostos favoritos: \n");
    for (int i = 0; i < p->favorites_count; i++) {
        printf(" - %s\n", p->favorites[i]);
    }
    printf("\n");
}

void printIdols(const Person *p) {
    printf("Ídolos e inspirações:\n");
    for (int i = 0; i < p->idols_count; i++) {
        printf(" - %s\n", p->idols[i]);
    }
    printf("\n");
}

void printTimeline(const Person *p) {
    printf("Linha do tempo (eventos registrados):\n\n");
    for (int i = 0; i < p->timeline_count; i++) {
        Event e = p->timeline[i];
        printf("[%02d/%02d/%04d] %s\n", e.date.day, e.date.month, e.date.year, e.title);
        printf("   %s\n\n", e.description);
    }
}

int main(void) {
    setlocale(LC_ALL, "");

    Person user = {0};

    user.name = "Mickeias Charles de Oliveira Paiva";
    user.birthdate.day = 3; user.birthdate.month = 10; user.birthdate.year = 2001;
    user.birthplace = "Brasília, Brasil";

    user.favorites[0] = "GTA San Andreas (Jogo)";
    user.favorites[1] = "Elden Ring (Jogo)";
    user.favorites[2] = "Assassin's Creed: Valhalla (Jogo)";
    user.favorites[3] = "Harry Potter (Filme)";
    user.favorites[4] = "Game of Thrones & House of the Dragon (Série)";
    user.favorites[5] = "Stranger Things (Série)";
    user.favorites[6] = "Breaking Bad (Série)";
    user.favorites[7] = "Silicon Valley (Série)";
    user.favorites[8] = "Vikings (Série)";
    user.favorites[9] = "O Alquimista (Livro)";
    user.favorites[10] = "A Sutil arte de ligar o Foda-se (Livro)";
    user.favorites[11] = "Código Limpo (Livro)";
    user.favorites[12] = "HomoDeus (Livro)";
    user.favorites_count = 13;

    user.idols[0] = "Travis Scott (Artista)";
    user.idols[1] = "Djavan (Cantor e Compositor)";
    user.idols[2] = "Alan Turing (Pai da Computação)";
    user.idols[3] = "George R.R. Martin (Escritor)";
    user.idols[4] = "Machado de Assis (Escritor)";
    user.idols[5] = "Hideo Kojima (Diretor de Games)";
    user.idols[6] = "Hidetaka Miyazaki (Diretor de Games)";
    user.idols_count = 7;

    int tc = 0;

    user.timeline[tc++] = (Event){"Nascimento",
        "Nascimento em Brasília.", {3,10,2001}};

    user.timeline[tc++] = (Event){"Interesse por tecnologia e jogos",
        "Infância e adolescência marcadas por curiosidade por tecnologia.", {0,0,2008}};

    user.timeline[tc++] = (Event){"Fez Auto-Escola",
        "Tirou habilitação.", {6,11,2022}};

    user.timeline[tc++] = (Event){"Fãs e shows de Travis Scott",
        "Grande fã de Travis Scott; foi a dois shows: Primavera Sound (SP) e Rock in Rio.", {6,11,2022}};

    user.timeline[tc++] = (Event){"Entrada na faculdade de Ciência da Computação",
        "Começou o curso e iniciou projetos práticos e acadêmicos, vendo o código como forma de arte.", {0,8,2024}};

    user.timeline[tc++] = (Event){"Projeto: ListBeat",
        "Aplicativo inspirado no Letterboxd para música, desenvolvido em SwiftUI.", {0,0,2024}};

    user.timeline[tc++] = (Event){"Projeto: Rolê",
        "Rede social para entretenimento cultural, entregue como projeto acadêmico.", {0,0,2024}};

    user.timeline[tc++] = (Event){"Trabalhos e estudos em diversas tecnologias",
        "Experiência com Swift, Java, JS, C, HTML, CSS, TS, SQL e desenvolvimento web.", {0,0,2024}};

    user.timeline[tc++] = (Event){"Projeto: Hubbies",
        "Plataforma de conexão universitária e portfólio profissional.", {0,0,2024}};

    user.timeline_count = tc;

    printHeader(&user);
    printFavorites(&user);
    printIdols(&user);
    printTimeline(&user);

    printf("ACOMPANHE PARA AS MINHAS PRÓXIMAS AVENTURAS.\n");

    return 0;
}`,
      terminalLines: [
        { text: 'C:\\Users\\Mickeias\\Dev> gcc Historia_Mickeias.c', cssClass: 'cmd-line' },
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
        { text: '   Tirou habilitação.', cssClass: '' },
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
      ],
    },
    about: {
      profileAlt: 'Foto de Mickeias',
      paragraphs: [
        'Graduando em Ciência da Computação pela Universidade Católica de Brasília, atuo como Desenvolvedor Fullstack com experiência em projetos acadêmicos e pessoais no desenvolvimento de sistemas.',
        'Possuo domínio em desenvolvimento frontend, trabalhando com HTML, CSS, JavaScript e TypeScript para criação de interfaces responsivas e intuitivas. No backend, desenvolvi projetos utilizando JavaScript com Node.js, realizando integração de APIs e estruturação de servidores.',
        'Tenho vivência na análise, desenvolvimento e manutenção de sistemas nas linguagens C e Java, além de experiência em prototipagem de interfaces e UX/UI design, criando fluxos de navegação e protótipos funcionais.',
        'Paralelamente, tenho domínio em Adobe Illustrator, focado na criação de logotipos, identidades visuais e ilustrações personalizadas para clientes de diferentes segmentos.',
      ],
      languagesTitle: 'Linguagens de domínio:',
      toolsTitle: 'Tecnologias e ferramentas de domínio:',
    },
    projects: {
      sideImageAlt: 'Imagem lateral de projetos',
      items: [
        {
          title: 'LUMA',
          description:
            'Desenvolvi uma landing page interativa para a startup Ideia Space, projetada para apresentar de forma moderna e imersiva o ecossistema educacional de engenharia espacial da plataforma LUMA. O site transforma conceitos complexos em uma experiência visual intuitiva, permitindo que o usuário explore a arquitetura de um nanossatélite educacional, seus subsistemas, sensores e o fluxo operacional de uma missão espacial simulada. A interface destaca aplicações práticas em escolas técnicas, universidades, laboratórios maker e programas STEM, unindo programação, eletrônica, física e análise de dados em um ambiente educacional inovador. O projeto foi desenvolvido com foco em experiência do usuário (UX), interatividade, identidade visual futurista e comunicação clara de conceitos tecnológicos avançados.',
          links: [
            repositoryLink('repositório', 'https://github.com/mickeiascharles/LUMA'),
            hostingLink('hospedagem', 'https://mickeiascharles.github.io/LUMA/assets/index.html'),
          ],
        },
        {
          title: 'ListBeat',
          description:
            'O ListBeat é um aplicativo offline de catálogo musical pessoal, inspirado no Letterboxd, mas voltado para músicas e álbuns. Ele permite ao usuário cadastrar faixas ou discos, avaliar com notas de 1 a 5 estrelas, escrever comentários, criar listas personalizadas e visualizar seu catálogo filtrando por gênero, artista ou nota. O app também mantém um histórico do que já foi ouvido. Sua proposta é oferecer uma plataforma simples e independente para organizar e revisitar músicas sem depender de serviços de streaming.',
          links: [repositoryLink('repositório', 'https://github.com/mickeiascharles/_ListBeat')],
        },
        {
          title: 'Hubbies',
          description:
            'Hubies é uma plataforma de rede social e portfólio profissional projetada para ser a ponte entre o talento universitário e o mercado de trabalho. A aplicação funciona como um "hub" onde estudantes podem exibir seus projetos acadêmicos e pessoais, enquanto empresas podem descobrir e se conectar com novos talentos de forma direcionada e interativa.',
          links: [
            repositoryLink('repositório', 'https://github.com/mickeiascharles/Hubies'),
            hostingLink('hospedagem', 'https://hubies.onrender.com/'),
          ],
        },
        {
          title: 'Calculadora',
          description:
            'Este projeto consiste em uma calculadora web funcional desenvolvida para aplicar conceitos fundamentais de TypeScript no desenvolvimento Frontend sem o uso de frameworks (Vanilla TS).',
          links: [
            repositoryLink('repositório', 'https://github.com/mickeiascharles/Calculadora'),
            hostingLink('hospedagem', 'https://mickeiascharles.github.io/Calculadora/'),
          ],
        },
        {
          title: 'ShelfShare',
          description:
            'ShelfShare é uma plataforma digital para o compartilhamento e empréstimo de livros entre usuários. A aplicação foi desenhada para funcionar como uma "biblioteca" comunitária, onde usuários podem disponibilizar livros que já leram e solicitar o empréstimo de títulos de outros membros da comunidade. O projeto foi construído com o objetivo principal de servir como um sistema completo para a aplicação prática de metodologias de teste de software.',
          links: [repositoryLink('repositório', 'https://github.com/mickeiascharles/ShelfShare')],
        },
        {
          title: 'Farmalink',
          description:
            'Farmalink é um sistema de marketplace de farmácias Full Stack que conecta clientes a uma variedade de medicamentos e produtos de saúde. A aplicação simula um ambiente de e-commerce real onde usuários podem pesquisar produtos, montar carrinhos de compras e acompanhar seus pedidos, enquanto administradores possuem controle total sobre o catálogo e as vendas. O projeto foi construído com o objetivo de aplicar conceitos avançados de desenvolvimento web, integrando um frontend moderno em React com uma API robusta em Node.js.',
          links: [repositoryLink('repositório', 'https://github.com/mickeiascharles/Farmalink')],
        },
        {
          title: 'InsightPro',
          description:
            'Projeto de sistema para usuários visualizarem seus painéis BI, com segurança e compartilhamento multi-tenant. Tecnologias usadas: HTML, CSS, JavaScript, API.',
          links: [
            repositoryLink('repositório', 'https://github.com/mickeiascharles/InsightPro'),
            hostingLink('hospedagem', 'https://mickeiascharles.github.io/InsightPro/'),
          ],
        },
        {
          title: 'MOV',
          description:
            'Projeto desenvolvido para matéria de Residência em parceria com a Startup Azzz. MOV é um sistema de monitoramento preventivo para evitar roubo de cabos e vandalismo em infraestrutura subterrânea. MOV é uma plataforma full-stack desenhada para monitorar em tempo real a abertura de bueiros, diferenciando eventos de Manutenção Agendada (Autorizada) de eventos de Violação (Não Autorizada) detectados por sensores IoT (Internet das Coisas). O objetivo principal foi criar um painel de controle robusto, seguro e reativo, com foco na Gestão de Incidentes e na Visualização Geográfica dos ativos.',
          links: [
            repositoryLink('repositório', 'https://github.com/mickeiascharles/MOV'),
            hostingLink('hospedagem', 'https://mickeiascharles.github.io/MOV/'),
          ],
        },
        {
          title: 'Calculadora de Orçamento por Ponto de Função',
          description:
            'Uma ferramenta web para estimativa de custos e prazos de desenvolvimento de software, baseada na metodologia IFPUG, com geração de propostas em PDF.',
          links: [
            repositoryLink('repositório', 'https://github.com/mickeiascharles/calculadora-apf'),
            hostingLink('hospedagem', 'https://mickeiascharles.github.io/calculadora-apf/'),
          ],
        },
      ],
    },
    hobbies: {
      title: 'Artes desenvolvidas',
      backgroundAlt: 'Mickeias High',
      items: [
        {
          description:
            'Logo e protótipo desenvolvidos para uma rede social de um projeto acadêmico.',
          image: 'assets/hubies-prototipo.png',
          alt: 'Protótipo Hubies',
          toolsLabel: 'Ferramentas:',
          tools: [illustrator, figma],
        },
        {
          description: 'Logo e protótipo desenvolvidos para um aplicativo do projeto HackTruck.',
          image: 'assets/ListBeat.png',
          alt: 'Protótipo ListBeat',
          toolsLabel: 'Ferramentas:',
          tools: [illustrator, figma],
        },
        {
          description: 'Logo desenvolvida para um projeto de residência.',
          image: 'assets/mov-logo.png',
          alt: 'Protótipo MOV',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
        {
          description: 'Pintura no Illustrator (Personagem no Espaço).',
          image: 'assets/painting.png',
          alt: 'Pintura digital',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
        {
          description: 'Pintura no Illustrator (Arte Cartoon).',
          image: 'assets/Lobo.jpg',
          alt: 'Pintura digital',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
        {
          description: 'Pintura no Illustrator (Personagem Cartoon).',
          image: 'assets/Miguel.png',
          alt: 'Pintura digital',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
        {
          description: 'Pintura no Illustrator (Arte Abstrata).',
          image: 'assets/arte.png',
          alt: 'Pintura digital',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
        {
          description: 'Pintura no Illustrator (Travis Scott).',
          image: 'assets/Travis.png',
          alt: 'Pintura digital',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
        {
          description: 'Pintura no Illustrator (Barba de Polvo).',
          image: 'assets/barba-pova.png',
          alt: 'Pintura digital',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
        {
          description: 'Pintura no Illustrator (Fantasy).',
          image: 'assets/kovucke.png',
          alt: 'Pintura digital',
          toolsLabel: 'Ferramenta:',
          tools: [illustrator],
        },
      ],
    },
    resume: {
      downloadLead: 'D',
      downloadRest: 'ownload aqui',
      downloadFileName: 'Mickeias_Charles_de_Oliveira_Paiva_curriculo.pdf',
      pageOneAlt: 'Currículo Página 1',
      pageTwoAlt: 'Carta de recomendação',
    },
  },
  en: {
    common: {
      copyright: 'Copyright©, All rights reserved.',
      languageSwitcherLabel: 'Select language',
      menuButtonLabel: 'Open navigation menu',
      portuguese: 'Portuguese',
      english: 'English',
      signatureAlt: 'Signature',
    },
    nav: {
      role: 'Software Developer',
      menuItems: [
        { label: 'Projects', route: '/projetos' },
        { label: 'Hobbies', route: '/hobbies' },
        { label: 'About me', route: '/sobre' },
        { label: 'Resume PDF', route: '/curriculo' },
      ],
    },
    home: {
      runButton: 'Compile / Run',
      runButtonTitle: 'Compile and run',
      characterAlt: 'Mickeias illustration',
      terminalTitle: 'Terminal - ./Life_Mickeias.c',
      codeSample: String.raw`/*
  Life_Mickeias.c
  A C program that represents the developer's life story (Mickeias).
*/

#include <stdio.h>
#include <stdlib.h>
#include <locale.h>

typedef struct {
    int day;
    int month;
    int year;
} Date;

typedef struct {
    const char *title;
    const char *description;
    Date date;
} Event;

typedef struct {
    const char *name;
    Date birthdate;
    const char *birthplace;
    const char *favorites[20];
    int favorites_count;
    const char *idols[20];
    int idols_count;
    Event timeline[32];
    int timeline_count;
} Person;

void printDate(Date d) {
    if (d.day == 0 && d.month == 0 && d.year == 0) printf("(unknown date)");
    else printf("%02d/%02d/%04d", d.day, d.month, d.year);
}

void printHeader(const Person *p) {
    printf("========================================\n");
    printf("Name: %s\n", p->name);
    printf("Birth: "); printDate(p->birthdate); printf(" - %s\n", p->birthplace);
    printf("========================================\n\n");
}

void printFavorites(const Person *p) {
    printf("Favorite things: \n");
    for (int i = 0; i < p->favorites_count; i++) {
        printf(" - %s\n", p->favorites[i]);
    }
    printf("\n");
}

void printIdols(const Person *p) {
    printf("Idols and inspirations:\n");
    for (int i = 0; i < p->idols_count; i++) {
        printf(" - %s\n", p->idols[i]);
    }
    printf("\n");
}

void printTimeline(const Person *p) {
    printf("Timeline (registered events):\n\n");
    for (int i = 0; i < p->timeline_count; i++) {
        Event e = p->timeline[i];
        printf("[%02d/%02d/%04d] %s\n", e.date.day, e.date.month, e.date.year, e.title);
        printf("   %s\n\n", e.description);
    }
}

int main(void) {
    setlocale(LC_ALL, "");

    Person user = {0};

    user.name = "Mickeias Charles de Oliveira Paiva";
    user.birthdate.day = 3; user.birthdate.month = 10; user.birthdate.year = 2001;
    user.birthplace = "Brasilia, Brazil";

    user.favorites[0] = "GTA San Andreas (Game)";
    user.favorites[1] = "Elden Ring (Game)";
    user.favorites[2] = "Assassin's Creed: Valhalla (Game)";
    user.favorites[3] = "Harry Potter (Movie)";
    user.favorites[4] = "Game of Thrones & House of the Dragon (Series)";
    user.favorites[5] = "Stranger Things (Series)";
    user.favorites[6] = "Breaking Bad (Series)";
    user.favorites[7] = "Silicon Valley (Series)";
    user.favorites[8] = "Vikings (Series)";
    user.favorites[9] = "The Alchemist (Book)";
    user.favorites[10] = "The Subtle Art of Not Giving a F*ck (Book)";
    user.favorites[11] = "Clean Code (Book)";
    user.favorites[12] = "Homo Deus (Book)";
    user.favorites_count = 13;

    user.idols[0] = "Travis Scott (Artist)";
    user.idols[1] = "Djavan (Singer and songwriter)";
    user.idols[2] = "Alan Turing (Father of Computing)";
    user.idols[3] = "George R.R. Martin (Writer)";
    user.idols[4] = "Machado de Assis (Writer)";
    user.idols[5] = "Hideo Kojima (Game Director)";
    user.idols[6] = "Hidetaka Miyazaki (Game Director)";
    user.idols_count = 7;

    int tc = 0;

    user.timeline[tc++] = (Event){"Birth",
        "Born in Brasilia.", {3,10,2001}};

    user.timeline[tc++] = (Event){"Interest in technology and games",
        "Childhood and teenage years marked by curiosity for technology.", {0,0,2008}};

    user.timeline[tc++] = (Event){"Driving school",
        "Earned a driver's license.", {6,11,2022}};

    user.timeline[tc++] = (Event){"Travis Scott fan and concerts",
        "Big Travis Scott fan; attended Primavera Sound (SP) and Rock in Rio.", {6,11,2022}};

    user.timeline[tc++] = (Event){"Started Computer Science college",
        "Started the program and practical academic projects, seeing code as art.", {0,8,2024}};

    user.timeline[tc++] = (Event){"Project: ListBeat",
        "An app inspired by Letterboxd for music, built with SwiftUI.", {0,0,2024}};

    user.timeline[tc++] = (Event){"Project: Role",
        "A cultural entertainment social network delivered as an academic project.", {0,0,2024}};

    user.timeline[tc++] = (Event){"Work and studies across several technologies",
        "Experience with Swift, Java, JS, C, HTML, CSS, TS, SQL and web development.", {0,0,2024}};

    user.timeline[tc++] = (Event){"Project: Hubbies",
        "A university connection platform and professional portfolio.", {0,0,2024}};

    user.timeline_count = tc;

    printHeader(&user);
    printFavorites(&user);
    printIdols(&user);
    printTimeline(&user);

    printf("FOLLOW ALONG FOR MY NEXT ADVENTURES.\n");

    return 0;
}`,
      terminalLines: [
        { text: 'C:\\Users\\Mickeias\\Dev> gcc Life_Mickeias.c', cssClass: 'cmd-line' },
        { text: ' ', cssClass: '' },
        { text: '========================================', cssClass: '' },
        { text: 'Name: Mickeias Charles de Oliveira Paiva', cssClass: '' },
        { text: 'Birth: 03/10/2001 - Brasilia, Brazil', cssClass: '' },
        { text: '========================================', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: 'Favorite things:', cssClass: '' },
        { text: ' - GTA San Andreas (Game)', cssClass: '' },
        { text: ' - Elden Ring (Game)', cssClass: '' },
        { text: " - Assassin's Creed: Valhalla (Game)", cssClass: '' },
        { text: ' - Harry Potter (Movie)', cssClass: '' },
        { text: ' - Game of Thrones & House of the Dragon (Series)', cssClass: '' },
        { text: ' - Stranger Things (Series)', cssClass: '' },
        { text: ' - Breaking Bad (Series)', cssClass: '' },
        { text: ' - Silicon Valley (Series)', cssClass: '' },
        { text: ' - Vikings (Series)', cssClass: '' },
        { text: ' - The Alchemist (Book)', cssClass: '' },
        { text: ' - The Subtle Art of Not Giving a F*ck (Book)', cssClass: '' },
        { text: ' - Clean Code (Book)', cssClass: '' },
        { text: ' - Homo Deus (Book)', cssClass: '' },
        { text: '------------', cssClass: '' },
        { text: 'Idols and inspirations:', cssClass: '' },
        { text: ' - Travis Scott (Artist)', cssClass: '' },
        { text: ' - Djavan (Singer and songwriter)', cssClass: '' },
        { text: ' - Alan Turing (Father of Computing)', cssClass: '' },
        { text: ' - George R.R. Martin (Writer)', cssClass: '' },
        { text: ' - Machado de Assis (Writer)', cssClass: '' },
        { text: ' - Hideo Kojima (Game Director)', cssClass: '' },
        { text: ' - Hidetaka Miyazaki (Game Director)', cssClass: '' },
        { text: '------------', cssClass: '' },
        { text: 'Timeline (registered events):', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[03/10/2001] Birth', cssClass: '' },
        { text: '   Born in Brasilia.', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[00/00/2008] Interest in technology and games', cssClass: '' },
        { text: '   Childhood marked by curiosity; GTA and AC shaped his taste.', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[06/11/2022] Driving school', cssClass: '' },
        { text: "   Earned a driver's license.", cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[06/11/2022] Travis Scott fan and concerts', cssClass: '' },
        { text: '   Primavera Sound (SP) and Rock in Rio.', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[00/08/2024] Started Computer Science college', cssClass: '' },
        { text: '   Started practical projects, seeing code as art.', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[00/00/2024] Project: ListBeat', cssClass: '' },
        { text: '   App inspired by Letterboxd for music (SwiftUI).', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[00/00/2024] Project: Role', cssClass: '' },
        { text: '   Cultural social network (Academic Project).', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[00/00/2024] Work and studies across several technologies', cssClass: '' },
        { text: '   Exp: Swift, Java, JS, C, HTML, CSS, TS, SQL, Web Dev.', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: '[00/00/2024] Project: Hubbies', cssClass: '' },
        { text: '   University connection and portfolio platform.', cssClass: '' },
        { text: '------------', cssClass: '' },
        { text: 'FOLLOW ALONG FOR MY NEXT ADVENTURES.', cssClass: '' },
        { text: ' ', cssClass: '' },
        { text: 'C:\\Users\\Mickeias\\Dev> _', cssClass: 'cmd-line blink' },
      ],
    },
    about: {
      profileAlt: 'Photo of Mickeias',
      paragraphs: [
        'Computer Science undergraduate at the Catholic University of Brasília, working as a Fullstack Developer with experience in academic and personal system development projects.',
        'I have strong frontend development skills, working with HTML, CSS, JavaScript and TypeScript to create responsive and intuitive interfaces. On the backend, I have built projects with JavaScript and Node.js, integrating APIs and structuring servers.',
        'I have practical experience analyzing, developing and maintaining systems in C and Java, as well as prototyping interfaces and UX/UI design, creating navigation flows and functional prototypes.',
        'In parallel, I work with Adobe Illustrator, focused on creating logos, visual identities and custom illustrations for clients across different segments.',
      ],
      languagesTitle: 'Core languages:',
      toolsTitle: 'Core technologies and tools:',
    },
    projects: {
      sideImageAlt: 'Side image for projects',
      items: [
        {
          title: 'LUMA',
          description:
            'I developed an interactive landing page for the startup Ideia Space, designed to present the LUMA platform educational space engineering ecosystem in a modern and immersive way. The site turns complex concepts into an intuitive visual experience, allowing users to explore the architecture of an educational nanosatellite, its subsystems, sensors and the operational flow of a simulated space mission. The interface highlights practical applications for technical schools, universities, maker labs and STEM programs, combining programming, electronics, physics and data analysis in an innovative educational environment. The project was developed with a focus on user experience (UX), interactivity, futuristic visual identity and clear communication of advanced technology concepts.',
          links: [
            repositoryLink('repository', 'https://github.com/mickeiascharles/LUMA'),
            hostingLink('live site', 'https://mickeiascharles.github.io/LUMA/assets/index.html'),
          ],
        },
        {
          title: 'ListBeat',
          description:
            'ListBeat is an offline personal music catalog app inspired by Letterboxd, but focused on songs and albums. It lets users register tracks or records, rate them from 1 to 5 stars, write comments, create custom lists and browse their catalog by genre, artist or rating. The app also keeps a listening history. Its goal is to provide a simple and independent platform for organizing and revisiting music without relying on streaming services.',
          links: [repositoryLink('repository', 'https://github.com/mickeiascharles/_ListBeat')],
        },
        {
          title: 'Hubbies',
          description:
            'Hubies is a social network and professional portfolio platform designed to bridge university talent and the job market. The application works as a hub where students can showcase academic and personal projects, while companies can discover and connect with new talent in a targeted and interactive way.',
          links: [
            repositoryLink('repository', 'https://github.com/mickeiascharles/Hubies'),
            hostingLink('live site', 'https://hubies.onrender.com/'),
          ],
        },
        {
          title: 'Calculator',
          description:
            'This project is a functional web calculator built to apply core TypeScript concepts in frontend development without frameworks (Vanilla TS).',
          links: [
            repositoryLink('repository', 'https://github.com/mickeiascharles/Calculadora'),
            hostingLink('live site', 'https://mickeiascharles.github.io/Calculadora/'),
          ],
        },
        {
          title: 'ShelfShare',
          description:
            'ShelfShare is a digital platform for sharing and lending books between users. The application was designed as a community library where users can make books they have already read available and request loans from other community members. The project was built primarily as a complete system for applying software testing methodologies in practice.',
          links: [repositoryLink('repository', 'https://github.com/mickeiascharles/ShelfShare')],
        },
        {
          title: 'Farmalink',
          description:
            'Farmalink is a full-stack pharmacy marketplace system that connects customers to a variety of medicines and health products. The application simulates a real e-commerce environment where users can search for products, build shopping carts and track orders, while administrators have full control over the catalog and sales. The project was built to apply advanced web development concepts, integrating a modern React frontend with a robust Node.js API.',
          links: [repositoryLink('repository', 'https://github.com/mickeiascharles/Farmalink')],
        },
        {
          title: 'InsightPro',
          description:
            'A system project for users to view their BI dashboards with security and multi-tenant sharing. Technologies used: HTML, CSS, JavaScript, API.',
          links: [
            repositoryLink('repository', 'https://github.com/mickeiascharles/InsightPro'),
            hostingLink('live site', 'https://mickeiascharles.github.io/InsightPro/'),
          ],
        },
        {
          title: 'MOV',
          description:
            'Project developed for a residency course in partnership with the startup Azzz. MOV is a preventive monitoring system designed to reduce cable theft and vandalism in underground infrastructure. MOV is a full-stack platform built to monitor manhole openings in real time, distinguishing Scheduled Maintenance (Authorized) events from Violation (Unauthorized) events detected by IoT sensors. The main goal was to create a robust, secure and reactive control panel focused on Incident Management and Geographic Asset Visualization.',
          links: [
            repositoryLink('repository', 'https://github.com/mickeiascharles/MOV'),
            hostingLink('live site', 'https://mickeiascharles.github.io/MOV/'),
          ],
        },
        {
          title: 'Function Point Budget Calculator',
          description:
            'A web tool for estimating software development costs and deadlines, based on the IFPUG methodology, with PDF proposal generation.',
          links: [
            repositoryLink('repository', 'https://github.com/mickeiascharles/calculadora-apf'),
            hostingLink('live site', 'https://mickeiascharles.github.io/calculadora-apf/'),
          ],
        },
      ],
    },
    hobbies: {
      title: 'Created artwork',
      backgroundAlt: 'Mickeias High',
      items: [
        {
          description: 'Logo and prototype developed for an academic social network project.',
          image: 'assets/hubies-prototipo.png',
          alt: 'Hubies prototype',
          toolsLabel: 'Tools:',
          tools: [illustrator, figma],
        },
        {
          description: 'Logo and prototype developed for a HackTruck project app.',
          image: 'assets/ListBeat.png',
          alt: 'ListBeat prototype',
          toolsLabel: 'Tools:',
          tools: [illustrator, figma],
        },
        {
          description: 'Logo developed for a residency project.',
          image: 'assets/mov-logo.png',
          alt: 'MOV prototype',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
        {
          description: 'Illustrator painting (Character in Space).',
          image: 'assets/painting.png',
          alt: 'Digital painting',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
        {
          description: 'Illustrator painting (Cartoon Art).',
          image: 'assets/Lobo.jpg',
          alt: 'Digital painting',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
        {
          description: 'Illustrator painting (Cartoon Character).',
          image: 'assets/Miguel.png',
          alt: 'Digital painting',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
        {
          description: 'Illustrator painting (Abstract Art).',
          image: 'assets/arte.png',
          alt: 'Digital painting',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
        {
          description: 'Illustrator painting (Travis Scott).',
          image: 'assets/Travis.png',
          alt: 'Digital painting',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
        {
          description: 'Illustrator painting (Octopus Beard).',
          image: 'assets/barba-pova.png',
          alt: 'Digital painting',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
        {
          description: 'Illustrator painting (Fantasy).',
          image: 'assets/kovucke.png',
          alt: 'Digital painting',
          toolsLabel: 'Tool:',
          tools: [illustrator],
        },
      ],
    },
    resume: {
      downloadLead: 'D',
      downloadRest: 'ownload resume',
      downloadFileName: 'Mickeias_Charles_de_Oliveira_Paiva_resume.pdf',
      pageOneAlt: 'Resume page 1',
      pageTwoAlt: 'Recommendation letter',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly options = [
    { code: 'pt', label: 'PT', title: translations.pt.common.portuguese },
    { code: 'en', label: 'EN', title: translations.en.common.english },
  ] as const;

  readonly current = signal<LanguageCode>(this.getInitialLanguage());
  readonly text = computed(() => translations[this.current()]);

  constructor() {
    effect(() => {
      const language = this.current();

      if (typeof document !== 'undefined') {
        document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
      }

      try {
        window.localStorage.setItem('portfolio-language', language);
      } catch {
        // The language switch still works when storage is unavailable.
      }
    });
  }

  setLanguage(language: LanguageCode) {
    this.current.set(language);
  }

  private getInitialLanguage(): LanguageCode {
    try {
      const savedLanguage = window.localStorage.getItem('portfolio-language');

      if (savedLanguage === 'pt' || savedLanguage === 'en') {
        return savedLanguage;
      }

      return 'pt';
    } catch {
      return 'pt';
    }
  }
}
