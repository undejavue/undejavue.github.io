import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { MapComponent } from './components/map/map.component';
import { PollutionService } from './services/pollution.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ReportsComponent } from './components/reports/reports.component';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WebApiClient } from './api/web-api-client';
import { WebApiService } from './services/webapi.service';
import { StoreModule } from '@ngrx/store';
import { reducer } from './app.state';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export function configServiceFactory() {
  return new ConfigService(window['tempConfigStorage']);
}


const appRoutes: Routes = [
  { path: 'map', component: MainLayoutComponent },
  { path: 'reports/:id', component: ReportsComponent },
  { path: '',   redirectTo: '/map', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MapComponent,
    ReportsComponent,
    PageNotFoundComponent
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    StoreModule.forRoot(reducer),
     StoreDevtoolsModule.instrument({
      maxAge: 5
    }),
    EffectsModule.forRoot([
    ]),
  ],
  providers: [
    { provide: ConfigService, useFactory: configServiceFactory },
    PollutionService,
    WebApiClient,
    WebApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
