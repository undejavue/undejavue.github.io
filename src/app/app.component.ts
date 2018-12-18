import { Component, OnInit } from '@angular/core';
import { PollutionService } from './services/pollution.service';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'env-pollution-bel';
  isReady = false;

  constructor(private dataService: PollutionService, private config: ConfigService) { }

  ngOnInit() {
    this.dataService.isInitialized
      .pipe()
      .subscribe(result => {
        this.isReady = result;
        if (this.isReady) {
          const owner = this.config.get('owner');
          if (owner) {
            this.title = owner.title;
          }
        }
      });
  }
}
