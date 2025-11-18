import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    /* CORRIGIDO: Removemos a palavra 'Experimental' */
    provideZonelessChangeDetection(),

    provideRouter(routes),
  ],
};
