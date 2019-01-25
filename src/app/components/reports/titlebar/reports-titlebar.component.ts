import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { IDataModelItem } from '../../models/data-model-item.interface';
import { IOwner } from '../../models/owner.model';
import { PollutionTypeEnum } from '../../../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../../../api/contracts/reports/report-period.enum';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { ConfigService } from '../../../services/config.service';
import { getReportTitle } from '../helper';
import { GetReportsInfoAction } from '../../../store/reports/actions';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reports-titlebar',
  templateUrl: './reports-titlebar.component.html',
  styleUrls: ['./reports-titlebar.component.scss']
})
export class ReportsTitlebarComponent extends BaseComponent implements OnInit {
  @Input() reportId: any;
  reportInfo: IDataModelItem;
  isSpinner: boolean;
  owner: IOwner;
  reportTitle: string;
  type: PollutionTypeEnum;
  period: ReportPeriodEnum;
  today: Date;

  constructor(private snapshot: ActivatedRoute,
    private store: Store<AppState>,
    private config: ConfigService) {
    super(config);
    this.owner = this.config.get('owner');
  }

  ngOnInit() {
    this.today = new Date();
    this.snapshot.queryParams.pipe()
    .subscribe(params => {
      this.type = params['type'] || PollutionTypeEnum.Concentration;
      this.period = params['period'] || ReportPeriodEnum.ByDay;
      this.reportTitle = getReportTitle(this.type, this.period);
    });

  this.store.dispatch(new GetReportsInfoAction());
  this.store.select(s => s.reports.info)
    .pipe(takeUntil(this.destroy))
    .subscribe(info => {
      this.isSpinner = info.loading;
      if (!info.loading) {
        this.reportInfo = info.items.find(item => item.id === this.reportId);
      }
    });
  }

}
