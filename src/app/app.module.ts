import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { MapComponent } from './components/map/map.component';
import { PollutionService } from './services/pollution.service';
import { DistanceComponent } from './components/distance/distance.component';

export function configServiceFactory() {
  return new ConfigService(window['tempConfigStorage']);
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MapComponent,
    DistanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: ConfigService, useFactory: configServiceFactory },
    PollutionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
