import { LanguageCode } from '../../services/language';

type AlbumPhoto = {
  file: string;
  width: number;
  height: number;
  caption: Record<LanguageCode, string>;
};

export const albumPhotos: AlbumPhoto[] = [
  {
    file: 'Estudando_em_casa',
    width: 1440,
    height: 1920,
    caption: { pt: 'Estudando em casa', en: 'Studying at home' },
  },
  { file: 'Google', width: 1440, height: 1920, caption: { pt: 'Google', en: 'Google' } },
  {
    file: 'IINFRA2',
    width: 1440,
    height: 1920,
    caption: { pt: 'Na INFRA S.A.', en: 'At INFRA S.A.' },
  },
  {
    file: 'AWS',
    width: 1920,
    height: 1440,
    caption: { pt: 'Comunidade AWS', en: 'AWS community' },
  },
  {
    file: 'COCOHEADS_2026',
    width: 827,
    height: 711,
    caption: { pt: 'CocoaHeads 2026', en: 'CocoaHeads 2026' },
  },
  {
    file: 'BB_DIGITAL_WEEK_2025',
    width: 1440,
    height: 1920,
    caption: { pt: 'BB Digital Week 2025', en: 'BB Digital Week 2025' },
  },
  {
    file: 'Hackatruck',
    width: 1440,
    height: 1920,
    caption: { pt: 'HackaTruck', en: 'HackaTruck' },
  },
  {
    file: 'Azzz',
    width: 1280,
    height: 720,
    caption: { pt: 'Encontro na Azzz', en: 'Meeting at Azzz' },
  },
  {
    file: 'CAIXA',
    width: 1440,
    height: 1920,
    caption: { pt: 'Dia a dia na CAIXA', en: 'Everyday life at CAIXA' },
  },
  { file: 'CAIXA2', width: 1440, height: 1920, caption: { pt: 'Equipe CAIXA', en: 'CAIXA team' } },
  {
    file: 'INFRA',
    width: 1280,
    height: 720,
    caption: { pt: 'Equipe INFRA S.A.', en: 'INFRA S.A. team' },
  },
  {
    file: 'INFRA3',
    width: 720,
    height: 1280,
    caption: { pt: 'Encontro na INFRA S.A.', en: 'Gathering at INFRA S.A.' },
  },
  {
    file: 'monitoria',
    width: 1920,
    height: 1440,
    caption: { pt: 'Monitoria na UCB', en: 'Teaching assistance at UCB' },
  },
  {
    file: 'Faculdade',
    width: 1280,
    height: 960,
    caption: { pt: 'Projetos na faculdade', en: 'University projects' },
  },
  {
    file: 'Faculdade2',
    width: 1200,
    height: 1600,
    caption: { pt: 'Colegas da faculdade', en: 'University friends' },
  },
];
