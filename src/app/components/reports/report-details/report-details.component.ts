import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { ConfigService } from '../../../services/config.service';
import { CreateNavigationAction, SetNavigationActiveId } from '../../../store/configuration/actions';
import { navigationWithDetails, NavigationTabs } from '../../../config/navigation.config';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent extends BaseComponent implements OnInit {
  reportId: any;

  constructor(private snapshot: ActivatedRoute,
    private store: Store<AppState>,
    private config: ConfigService) {
    super(config);
  }

  ngOnInit() {

    this.store.dispatch(new SetNavigationActiveId(NavigationTabs.ReportCDay));

    this.snapshot.params.pipe()
      .subscribe(p => {
        this.reportId = p['id'];
        if (this.reportId) {
          this.store.dispatch(new CreateNavigationAction(navigationWithDetails(this.reportId)));
        }
      });


  }

}
