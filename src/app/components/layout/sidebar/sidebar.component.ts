import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '../.././../app.state';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../base-component';
import { ConfigService } from '../../../services/config.service';

export interface INavItem {
  routerLink: string[];
  queryParams: {};
  id: string;
  title: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BaseComponent implements OnInit {

  items: INavItem[] = [];
  activeId = '';

  constructor(private store: Store<AppState>, config: ConfigService) {
    super(config);
   }

  ngOnInit() {
    this.store.select(s => s.config.navigation)
      .pipe(takeUntil(this.destroy))
      .subscribe(config => {
        if (config && config) {
          this.items = config.items;
          this.activeId = config.activeId;
        }
      });

  }

  isActive(tabId: string) {
    return tabId === this.activeId;
  }

}
