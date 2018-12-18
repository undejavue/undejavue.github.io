import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollutionService } from '../../services/pollution.service';
import { IDataModelItem } from '../models/data-model-item.interface';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportId: any;
  reportInfo: IDataModelItem;

  constructor(private snapshot: ActivatedRoute, private service: PollutionService) { }

  ngOnInit() {
    this.snapshot.params.pipe()
      .subscribe(p => {
        this.reportId = p['id'];
        this.reportInfo = this.service.getReportInfo(this.reportId);
      });
  }

}
