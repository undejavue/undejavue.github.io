import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from '../../base-component';
import { ConfigService } from '../../../services/config.service';
import { AppState } from '../../../app.state';
import { SetNavigationActiveId, CreateNavigationAction } from '../../../store/configuration/actions';
import { NavigationTabs, navigationItems } from '../../../config/navigation.config';
import { GetReportsInfoAction } from '../../../store/reports/actions';
import { takeUntil } from 'rxjs/operators';
import { IOwner } from '../../models/owner.model';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})

export class ReportsListComponent extends BaseComponent implements OnInit {

  items: any[];
  isSpinner: boolean;
  webApis: {};
  owner: IOwner;
  constructor(config: ConfigService, private store: Store<AppState>) {
    super(config);
    this.owner = config.get('owner');
    this.webApis = config.get('webApiUrls');
  }

  ngOnInit() {

    this.store.dispatch(new CreateNavigationAction(navigationItems()));
    this.store.dispatch(new SetNavigationActiveId(NavigationTabs.ReportsList));
    this.store.dispatch(new GetReportsInfoAction());

    this.store.select(s => s.reports.info)
      .pipe(takeUntil(this.destroy))
      .subscribe(info => {
        this.isSpinner = info.loading;
        if (!info.loading && info.items) {
          this.items = info.items;
          this.items.forEach(item => {
            item['approved'] = this.webApis[item.id] !== undefined;
          });
        }
      });
  }

}
