import { Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { MapHelperService } from './services/map.helper.service';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { CreateNavigationAction } from './store/configuration/actions';
import { Router } from '@angular/router';
import { NavigationTabs, navigationItems } from './config/navigation.config';

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

    const navItems = navigationItems();

    this.store.dispatch(new CreateNavigationAction(navItems));

  }
}
