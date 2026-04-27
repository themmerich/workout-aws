import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { catchError, firstValueFrom, of } from 'rxjs';

import { routes } from './app.routes';
import { AuthService } from './core/auth/auth-service';
import { withCredentialsInterceptor } from './core/auth/with-credentials-interceptor';
import { TranslocoHttpLoader } from './core/transloco/transloco-http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([withCredentialsInterceptor])),
    provideAnimationsAsync(),
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return firstValueFrom(auth.me().pipe(catchError(() => of(null))));
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideTransloco({
      config: {
        availableLangs: ['de', 'en'],
        defaultLang: 'de',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
