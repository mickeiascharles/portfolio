import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language';

/** Logo exibida na seção de habilidades; o nome aparece ao passar o mouse. */
type Tecnologia = { nome: string; icone: string };

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css',
})
export class SobreComponent {
  readonly language = inject(LanguageService);

  readonly linguagens: Tecnologia[] = [
    { nome: 'HTML5', icone: 'html5' },
    { nome: 'CSS3', icone: 'css3' },
    { nome: 'SQL', icone: 'sql' },
    { nome: 'Java', icone: 'java' },
    { nome: 'C', icone: 'c' },
    { nome: 'Swift', icone: 'swift' },
    { nome: 'JavaScript', icone: 'javascript' },
    { nome: 'TypeScript', icone: 'typescript' },
    { nome: 'Python', icone: 'python' },
    { nome: 'C++', icone: 'cpp' },
    { nome: 'Dart', icone: 'dart' },
    { nome: 'COBOL', icone: 'cobol' },
    { nome: 'Assembly', icone: 'assembly' },
  ];

  readonly ferramentas: Tecnologia[] = [
    { nome: 'Node.js', icone: 'nodejs' },
    { nome: 'React', icone: 'react' },
    { nome: 'Vite', icone: 'vite' },
    { nome: 'Git', icone: 'git' },
    { nome: 'Axios', icone: 'axios' },
    { nome: 'Angular', icone: 'angular' },
    { nome: 'Postman', icone: 'postman' },
    { nome: 'Express', icone: 'express' },
    { nome: 'PyTorch', icone: 'pytorch' },
    { nome: 'Keras', icone: 'keras' },
    { nome: 'Kubernetes', icone: 'kubernetes' },
    { nome: 'Jupyter Notebook', icone: 'jupyter' },
    { nome: 'Google Colab', icone: 'googlecolab' },
    { nome: 'TensorFlow', icone: 'tensorflow' },
    { nome: 'Scikit-learn', icone: 'scikitlearn' },
  ];
}
