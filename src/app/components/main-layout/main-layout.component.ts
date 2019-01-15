import { Component, OnInit } from '@angular/core';
import { PollutionService } from '../../services/pollution.service';
import { ConfigService } from '../../services/config.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../app.state';
import { GetCurrentValuesAction } from '../../store/pollutions/actions';
import { CreateConfigurationAction } from '../../store/configuration/actions';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base-component';
import { IDataModelItem } from '../models/data-model-item.interface';
import { pipe } from 'rxjs';
import { IMarker } from '../models/marker.interface';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent extends BaseComponent implements OnInit {
  isReady = false;
  owner: {
    name: string,
    title: string,
    site: string,
    department: string
  };
  isSpinner: boolean;
  dataModel: IDataModelItem[];
  markers: IMarker[];

  constructor(private dataService: PollutionService,
    private config: ConfigService,
    private store: Store<AppState>) {
    super(config);
  }

  ngOnInit() {
    this.dataService.isInitialized
      .pipe()
      .subscribe(result => {
        this.isReady = result;
        if (this.isReady) {
          this.owner = this.config.get('owner');

          this.store.select(state => state.config.dataModel)
            .pipe(takeUntil(this.destroy))
            .subscribe(s => {
              this.isSpinner = s.loading;
              if (!s.loading) {
                this.dataModel = s.items;
                this.markers = this.createMapMarkers();
              }
            });

          this.store.select(state => state.pollutions.data)
            .pipe(takeUntil(this.destroy))
            .subscribe(values => {
              console.log('Current values: ', values);
            });
        }
      });

      this.initSubscriptions();
  }

  initSubscriptions() {
    this.store.dispatch(new CreateConfigurationAction());
    this.store.dispatch(new GetCurrentValuesAction('molodechno'));
  }

  createMapMarkers() {
    const result = new Array<IMarker>();
        if (this.dataModel) {
            this.dataModel.map(obj => {
                const m: IMarker = {
                    id: obj.id,
                    title: obj.title,
                    address: obj.address,
                    geo: {
                        longtitude: obj.longtitude,
                        latitude: obj.latitude
                    }
                };
                result.push(m);
            });
            return result;
        }
  }

}
