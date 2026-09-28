import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { SobreComponent } from './components/sobre/sobre';
import { ProjetosComponent } from './components/projetos/projetos';
import { HobbiesComponent } from './components/hobbies/hobbies';
import { CurriculoComponent } from './components/curriculo/curriculo';
import { AlbumComponent } from './components/album/album';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'projetos', component: ProjetosComponent },
  { path: 'hobbies', component: HobbiesComponent },
  { path: 'album', component: AlbumComponent },
  { path: 'curriculo', component: CurriculoComponent },
  { path: '**', redirectTo: '' },
];
