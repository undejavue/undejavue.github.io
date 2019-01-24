import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { ConfigService } from '../../../services/config.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { SetNavigationActiveId } from '../../../store/configuration/actions';
import { NavigationTabs } from '../../../config/navigation.config';
import { GroupByPipe } from '../../../pipes/groupby.pipe';
import { ReportDto } from '../../../api/contracts/reports/report.dto';
import { ActivatedRoute } from '@angular/router';
import { PollutionTypeEnum } from '../../../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../../../api/contracts/reports/report-period.enum';
import { GetReportAction } from '../../../store/reports/actions';
import { takeUntil } from 'rxjs/operators';

export interface ISelectedReport {
  type: PollutionTypeEnum;
  period: ReportPeriodEnum;
  id: string;
}

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent extends BaseComponent implements OnInit {
  @Input() reportId;
  report: ReportDto;
  dataset = [];
  headerRow: any;
  updatedOn: any;
  selectedReport: ISelectedReport = {
    type: PollutionTypeEnum.Concentration,
    period: ReportPeriodEnum.ByDay,
    id: ''
  };
  isSpinner: boolean;
  constructor(
    private snapshot: ActivatedRoute,
    config: ConfigService,
    private store: Store<AppState>,
    protected groupby: GroupByPipe) {
    super(config);
  }

  ngOnInit() {

    this.snapshot.queryParams.pipe()
      .subscribe(params => {
        this.selectedReport.type = params['type'] || PollutionTypeEnum.Concentration;
        this.selectedReport.period = params['period'] || ReportPeriodEnum.ByDay;
        this.selectedReport.id = this.reportId;
        if (this.selectedReport) {
          this.store.dispatch(
            new GetReportAction(
              this.selectedReport.id,
              this.selectedReport.type,
              this.selectedReport.period));
        }
      });

    this.store.select(s => s.reports.data)
      .pipe(takeUntil(this.destroy))
      .subscribe(data => {
        this.isSpinner = data.loading;
        if (!data.loading && data.byObjectId) {
          this.report = data.byObjectId[this.reportId];
          if (this.report) {
            this.transformReportData(this.report);
          }
        }
      });


  }

  transformReportData(source: ReportDto) {
    const mapped = [];
    source.datasets.map(d => d.items.map(item => mapped.push(item)));
    // mapped = mapped.concat(this.data.datasets.map(d => d.items));
    const grouped = this.groupby.transform(mapped, 'timeStamp');

    Object.keys(grouped).forEach(key => {
      this.dataset.push(grouped[key]);
    });
    if (this.dataset && this.dataset.length > 0) {
      this.headerRow = this.dataset[0];
      this.updatedOn = this.dataset[0][0].timeStamp;
    }
  }
}
