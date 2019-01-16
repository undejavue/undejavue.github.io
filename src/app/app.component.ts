import { Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { MapHelperService } from './services/map.helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'env-pollution-bel';
  isReady = false;

  constructor(private dataService: MapHelperService, private config: ConfigService) { }

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
