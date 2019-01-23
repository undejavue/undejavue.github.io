import { Component, OnInit, Input } from '@angular/core';
import { ReportDto } from '../../../api/contracts/reports/report.dto';
import { GroupByPipe } from '../../../pipes/groupby.pipe';


@Component({
  selector: 'app-by-day',
  templateUrl: './by-day.component.html',
  styleUrls: ['./by-day.component.scss']
})
export class ByDayComponent implements OnInit {
  @Input() data: ReportDto;
  @Input() reportTitle: string;
  dataset = [];
  headerRow: any;
  
  constructor(protected groupby: GroupByPipe) { }

  ngOnInit() {

    if (this.data) {
      const mapped = [];
      this.data.datasets.map(d => d.items.map(item => mapped.push(item)));
      // mapped = mapped.concat(this.data.datasets.map(d => d.items));
      const grouped = this.groupby.transform(mapped, 'timeStamp');

      Object.keys(grouped).forEach(key => {
        this.dataset.push(grouped[key]);
      });
      if (this.dataset && this.dataset.length > 0) {
        this.headerRow = this.dataset[0];
      }
    }
  }

}
