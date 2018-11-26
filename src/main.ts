import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  console.log('PROD');
  enableProdMode();
} else {
  console.log('DEV');
}

function bootstrapFailed(val) {
  // document.getElementById('app-something-wrong').style.display = 'block';
  console.error('bootstrap-fail', val);
}

fetch('assets/configuration.json')
  .then(response => response.json())
  .then(config => {
    // console.log('config', config);
    if (!config) {
      bootstrapFailed(config);
      return;
    }

    // Store the response somewhere that your ConfigService can read it.
    window['tempConfigStorage'] = config;

    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(bootstrapFailed);
  })
  .catch(bootstrapFailed);
