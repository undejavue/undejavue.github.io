import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { MapLayoutComponent } from './components/map-layout/map-layout.component';
import { MapComponent } from './components/map/map.component';
import { PollutionService } from './services/pollution.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
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
import { GroupByPipe } from './pipes/groupby.pipe';
import { ReportTableComponent } from './components/reports/report-table/report-table.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { ContentLayoutComponent } from './components/layout/content-layout/content-layout.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { ReportsListComponent } from './components/reports/reports-list/reports-list.component';
import { ReportInfoComponent } from './components/reports/report-info/report-info.component';
import { TitlebarComponent } from './components/layout/titlebar/titlebar.component';
import { ReportsLayoutComponent } from './components/reports/reports-layout/reports-layout.component';
import { ReportDetailsComponent } from './components/reports/report-details/report-details.component';
import { appRoutes } from './app.routes';
import { ReportsTitlebarComponent } from './components/reports/titlebar/reports-titlebar.component';
import { SpinnerModule } from 'spinner-angular';

export function configServiceFactory() {
  return new ConfigService(window['tempConfigStorage']);
}

let hasRouterError = false;
export function routerErrorHandler(error: any) {
  console.log('RouterErrorHandler: ' + error);
  hasRouterError = true;
  throw error;
}

const routerModule: ModuleWithProviders = RouterModule.forRoot(appRoutes, {
  initialNavigation: true,
  errorHandler: routerErrorHandler,
  enableTracing: true
});

@NgModule({
  declarations: [
    AppComponent,
    MapLayoutComponent,
    MapComponent,
    PageNotFoundComponent,
    ReportTableComponent,
    MainLayoutComponent,
    ContentLayoutComponent,
    SidebarComponent,
    ReportsListComponent,
    ReportInfoComponent,
    TitlebarComponent,
    ReportsLayoutComponent,
    ReportDetailsComponent,
    ReportsTitlebarComponent
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    routerModule,
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
    SpinnerModule.forRoot({}),
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
