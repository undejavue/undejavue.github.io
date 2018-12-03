import { Component, OnInit } from '@angular/core';
import { PollutionService } from '../../services/pollution.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isReady = false;
  constructor(private dataService: PollutionService) { }

  ngOnInit() {
    this.dataService.isInitialized
      .pipe()
      .subscribe(result => {
        this.isReady = result.dataReady && result.objectsReady;
      });
  }

}
