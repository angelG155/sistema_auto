import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';
import { PermisionAuth } from './pages/auth/service/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
              provideRouter(routes,
                withInMemoryScrolling({
                  scrollPositionRestoration: 'top', // Esto hará que se desplace automáticamente hacia la parte superior
                  anchorScrolling: 'enabled' // Habilita el desplazamiento a anclajes dentro de la página
                })),
              provideAnimations(), // required animations providers
              provideToastr(),
              provideHttpClient(
                withFetch()
              ),
              provideClientHydration(),
              CookieService,
              PermisionAuth
            ]
};

// provideHttpClient(
//   withFetch(),
//   withInterceptors([
//     (req, next) => cacheInterceptorFn(new CacheService())(req, next) // Proveer el interceptor como función
//   ])
// ),
