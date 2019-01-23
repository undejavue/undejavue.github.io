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
import { reducers } from './app.state';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfigEffects } from './store/configuration/effects';
import { PollutionEffects } from './store/pollutions/effects';
import { ReportsEffects } from './store/reports/effects';
import { MapHelperService } from './services/map.helper.service';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { FixtureModalComponent } from './components/modal/fixture-modal/fixture-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ByDayComponent } from './components/reports/by-day/by-day.component';
import { GroupByPipe } from './pipes/groupby.pipe';
import { ReportTableComponent } from './components/reports/report-table/report-table.component';

export function configServiceFactory() {
  return new ConfigService(window['tempConfigStorage']);
}


const appRoutes: Routes = [
  { path: 'map', component: MainLayoutComponent },
  { path: 'reports/:id', component: ReportsComponent },
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MapComponent,
    ReportsComponent,
    PageNotFoundComponent,
    FixtureModalComponent,
    ByDayComponent,
    ReportTableComponent
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
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 5
    }),
    EffectsModule.forRoot([
      ConfigEffects,
      PollutionEffects,
      ReportsEffects
    ]),
    ModalDialogModule.forRoot(),
    NgbModule
  ],
  providers: [
    { provide: ConfigService, useFactory: configServiceFactory },
    PollutionService,
    WebApiClient,
    WebApiService,
    MapHelperService,
    GroupByPipe,
  ],
  entryComponents: [
    FixtureModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
