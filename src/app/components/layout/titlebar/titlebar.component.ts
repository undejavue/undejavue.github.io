import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { ConfigService } from '../../../services/config.service';
import { IOwner } from '../../models/owner.model';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent extends BaseComponent implements OnInit {
  owner: IOwner;

  constructor(config: ConfigService) {
    super(config);
    this.owner = config.get('owner');
  }

  ngOnInit() {
  }

}
