import { Routes } from '@angular/router';
import { MapLayoutComponent } from './components/map-layout/map-layout.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { ContentLayoutComponent } from './components/layout/content-layout/content-layout.component';
import { TitlebarComponent } from './components/layout/titlebar/titlebar.component';
import { ReportsLayoutComponent } from './components/reports/reports-layout/reports-layout.component';
import { ReportDetailsComponent } from './components/reports/report-details/report-details.component';
import { ReportInfoComponent } from './components/reports/report-info/report-info.component';
import { ReportsListComponent } from './components/reports/reports-list/reports-list.component';
import { LoggedInGuard } from './login-guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/map',
        pathMatch: 'full'
    },
/*     {
        path: '**',
        component: PageNotFoundComponent
    }, */
    {
        path: 'map',
        component: MapLayoutComponent
    },
    {
        path: 'reports',
        redirectTo: '/reports/list',
        pathMatch: 'full'
    },
    {
        path: 'report/details/:id',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: ContentLayoutComponent,
                outlet: 'main',
                children: [
                    {
                        path: '',
                        component: TitlebarComponent,
                        outlet: 'header'
                    },
                    {
                        path: '',
                        component: ReportsLayoutComponent,
                        outlet: 'principal',
                        children: [
                            {
                                path: '',
                                component: ReportDetailsComponent,
                                outlet: 'content'
                            }
                        ]
                    },
                ]
            }
        ]
    },
    {
        path: 'report/info/:id',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: ContentLayoutComponent,
                outlet: 'main',
                children: [
                    {
                        path: '',
                        component: TitlebarComponent,
                        outlet: 'header'
                    },
                    {
                        path: '',
                        component: ReportsLayoutComponent,
                        outlet: 'principal',
                        children: [
                            {
                                path: '',
                                component: ReportInfoComponent,
                                outlet: 'content'
                            }
                        ]
                    },
                ]
            }
        ]
    },
    {
        path: 'reports/list',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: ContentLayoutComponent,
                outlet: 'main',
                children: [
                    {
                        path: '',
                        component: TitlebarComponent,
                        outlet: 'header'
                    },
                    {
                        path: '',
                        component: ReportsLayoutComponent,
                        outlet: 'principal',
                        children: [
                            {
                                path: '',
                                component: ReportsListComponent,
                                outlet: 'content'
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
