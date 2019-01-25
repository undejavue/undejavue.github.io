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
import { IReportModel } from '../../../store/reports/state';

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
  report: IReportModel;

  selectedReport: ISelectedReport = {
    type: PollutionTypeEnum.Concentration,
    period: ReportPeriodEnum.ByDay,
    id: ''
  };

  isSpinner: boolean;
  webApis: {};
  underConstruct: boolean;
  noDataFromApi: boolean;
  constructor(
    private snapshot: ActivatedRoute,
    config: ConfigService,
    private store: Store<AppState>,
    protected groupby: GroupByPipe) {
    super(config);
    this.webApis = config.get('webApiUrls');
  }

  ngOnInit() {

    if (!this.webApis[this.reportId]) {
      this.underConstruct = true;
      this.isSpinner = false;
      return;
    }

    this.snapshot.queryParams.pipe()
      .subscribe(params => {
        this.noDataFromApi = false;
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
      .subscribe(s => {
        this.isSpinner = s.loading;
        const dto = s.byId[this.reportId];
        this.report = this.transformReportData(dto);

      });
  }


  transformReportData(source: ReportDto) {
    if (!source || !source.datasets) {
      this.noDataFromApi = true;
      return undefined;
    }

    const result: IReportModel = {
      datasets: [],
      headerRow: [],
      updatedOn: ''
    };
    const mapped = [];
    source.datasets.map(d => d.items.map(item => mapped.push(item)));
    const grouped = this.groupby.transform(mapped, 'timeStamp');

    Object.keys(grouped).forEach(key => {
      result.datasets.push(grouped[key]);
    });

    if (result.datasets.length > 0) {
      result.headerRow = result.datasets[0];
      result.updatedOn = result.datasets[0][0].timeStamp;
    }

    return result;
  }
}
