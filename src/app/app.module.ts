import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { MapComponent } from './components/map/map.component';
import { PollutionService } from './services/pollution.service';

export function configServiceFactory() {
  return new ConfigService(window['tempConfigStorage']);
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: ConfigService, useFactory: configServiceFactory },
    PollutionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
