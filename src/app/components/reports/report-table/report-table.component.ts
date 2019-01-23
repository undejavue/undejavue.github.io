import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit {
  @Input() dataset: any[];
  @Input() headerRow: any[];
  constructor() { }

  ngOnInit() {
  }

}
