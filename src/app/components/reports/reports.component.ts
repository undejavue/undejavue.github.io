import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollutionService } from '../../services/pollution.service';
import { IDataModelItem } from '../models/data-model-item.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base-component';
import { ConfigService } from '../../services/config.service';
import { GetReportsInfoAction, GetReportAction } from '../../store/reports/actions';
import { PollutionTypeEnum } from '../../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../../api/contracts/reports/report-period.enum';
import { ReportDto } from '../../api/contracts/reports/report.dto';

export interface ISelectedReport {
  type: PollutionTypeEnum;
  period: ReportPeriodEnum;
  id: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends BaseComponent implements OnInit {
  reportId: any;
  reportInfo: IDataModelItem;
  isSpinner: boolean;
  selectedReport: ISelectedReport;
  report: ReportDto;
  owner: {
    name: string,
    title: string,
    site: string,
    department: string
  };

  constructor(private snapshot: ActivatedRoute,
    private service: PollutionService,
    private store: Store<AppState>,
    private config: ConfigService,
    private router: Router) {
    super(config);
    this.owner = this.config.get('owner');
  }

  ngOnInit() {

    this.snapshot.params.pipe()
      .subscribe(p => {
        this.reportId = p['id'];
        if (this.reportId) {
          this.selectedReport = {
            type: PollutionTypeEnum.Emission,
            period: ReportPeriodEnum.ByDay,
            id: this.reportId
          };
        }
      });

    this.snapshot.queryParams.pipe()
      .subscribe(params => {
        this.selectedReport.type = params['type'] || PollutionTypeEnum.Concentration;
        this.selectedReport.period = params['period'] || ReportPeriodEnum.ByDay;
        if (this.reportInfo && this.selectedReport) {
          this.store.dispatch(
            new GetReportAction(this.selectedReport.id,
              this.selectedReport.type,
              this.selectedReport.period));
        }
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

    this.store.select(s => s.reports.data)
      .pipe(takeUntil(this.destroy))
      .subscribe(data => {
        this.isSpinner = data.loading;
        if (!data.loading && data.byObjectId) {
          this.report = data.byObjectId[this.reportId];
        }
      });


  }

  isActive(tabId: string) {
    const result = tabId === `${this.selectedReport.type}-${this.selectedReport.period}`;
    return result;
  }

}
