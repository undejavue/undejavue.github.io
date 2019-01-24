import { Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { MapHelperService } from './services/map.helper.service';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { CreateNavigationAction } from './store/configuration/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'env-pollution-bel';
  isReady = false;

  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit() {

    // this.router.initialNavigation();

    const navItems = [
      {
        routerLink: ['/map'],
        queryParams: {},
        id: 'map',
        title: 'Интерактивная карта'
      },
      {
        routerLink: ['/reports/list'],
        queryParams: {},
        id: 'reports-list',
        title: 'Список объектов'
      }
    ];

    this.store.dispatch(new CreateNavigationAction(navItems));

  }
}
