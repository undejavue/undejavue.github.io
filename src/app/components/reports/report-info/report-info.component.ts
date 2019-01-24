import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { SetNavigationActiveId, CreateNavigationAction } from '../../../store/configuration/actions';
import { NavigationTabs, navigationWithDetails } from '../../../config/navigation.config';
import { BaseComponent } from '../../base-component';
import { GetReportsInfoAction } from '../../../store/reports/actions';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent extends BaseComponent implements OnInit {
  isSpinner: boolean;
  info: any;
  reportId: any;
  owner: {
    name: string,
    title: string,
    site: string,
    department: string
  };

  constructor(private snapshot: ActivatedRoute, config: ConfigService, private store: Store<AppState>) {
    super(config);
    this.owner = config.get('owner');
  }

  ngOnInit() {
    this.store.dispatch(new SetNavigationActiveId(NavigationTabs.ReportInfo));

    this.snapshot.params.pipe()
    .subscribe(p => {
      this.reportId = p['id'];
      if (this.reportId) {
        this.store.dispatch(new CreateNavigationAction(navigationWithDetails(this.reportId)));
      }
    });

    this.store.dispatch(new GetReportsInfoAction());
    this.store.select(s => s.reports.info)
      .pipe(takeUntil(this.destroy))
      .subscribe(info => {
        this.isSpinner = info.loading;
        if (!info.loading) {
          this.info = info.items.find(item => item.id === this.reportId);
        }
      });
  }

}
