import {
  ApplicationConfig,
  LOCALE_ID,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import { provideRouter, withHashLocation } from '@angular/router';

// @angular/material
import { MatPaginatorIntl } from '@angular/material/paginator';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { MAT_TABS_CONFIG, MatTabsConfig } from '@angular/material/tabs';

import { routes } from './app.routes';
import { PaginatorIntl } from './shared/paginator-intl';

import localeZhHant from '@angular/common/locales/zh-Hant';

registerLocaleData(localeZhHant);

const SNACK_BAR_DEFAULT_OPTIONS: MatSnackBarConfig = {
  duration: 3000,
};
const TABS_CONFIG: MatTabsConfig = {
  animationDuration: '0ms',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimationsAsync(),
    makeEnvironmentProviders([
      { provide: LOCALE_ID, useValue: 'zh-Hant' },
      {
        provide: MatPaginatorIntl,
        useClass: PaginatorIntl,
      },
      {
        provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
        useValue: SNACK_BAR_DEFAULT_OPTIONS,
      },
      {
        provide: MAT_TABS_CONFIG,
        useValue: TABS_CONFIG,
      },
    ]),
  ],
};
