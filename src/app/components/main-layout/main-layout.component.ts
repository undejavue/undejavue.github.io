import { Component, OnInit } from '@angular/core';
import { PollutionService } from '../../services/pollution.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isReady = false;
  owner: {
    name: string,
    title: string,
    site: string,
    department: string
  };

  constructor(private dataService: PollutionService, private config: ConfigService) { }

  ngOnInit() {
    this.dataService.isInitialized
      .pipe()
      .subscribe(result => {
        this.isReady = result;
        if (this.isReady) {
          this.owner = this.config.get('owner');
        }
      });
  }

}
