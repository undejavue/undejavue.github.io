import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { ConfigService } from '../../../services/config.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';

@Component({
  selector: 'app-reports-layout',
  templateUrl: './reports-layout.component.html',
  styleUrls: ['./reports-layout.component.scss']
})
export class ReportsLayoutComponent extends BaseComponent implements OnInit {

  constructor(config: ConfigService, private store: Store<AppState>) {
    super(config);
  }

  ngOnInit() {
  }

}
