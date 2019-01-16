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
import { CurrentValuesDto } from '../../api/contracts/current-values/current-values.dto';
import { MapHelperService } from '../../services/map.helper.service';

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
  currentValues: { [objectId: string]: CurrentValuesDto; };

  constructor(private mapService: MapHelperService,
    private pollutionService: PollutionService,
    private config: ConfigService,
    private store: Store<AppState>) {
    super(config);
    this.mapService.init();
  }

  ngOnInit() {
    this.mapService.isInitialized
      .pipe()
      .subscribe(result => {
        this.isReady = result;
        if (this.isReady) {
          this.pollutionService.init(this.mapService.getDefaults(), this.mapService.getParametres());
          this.owner = this.config.get('owner');
          this.initActions();

          this.store.select(state => state.config.dataModel)
            .pipe(takeUntil(this.destroy))
            .subscribe(s => {
              this.isSpinner = s.loading;
              if (!s.loading && s.items && s.items.length > 0) {
                this.dataModel = s.items;
                this.markers = this.createMapMarkers();
                this.getRealDataCycle();
              }
            });

          this.store.select(state => state.pollutions.data)
            .pipe(takeUntil(this.destroy))
            .subscribe(s => {
              if (!s.loading && s.byId) {
                this.currentValues = s.byId;
              }
            });
        }
      });
  }

  initActions() {
    this.store.dispatch(new CreateConfigurationAction());
  }

  getValuesById(objectId: string): CurrentValuesDto {
    if (this.currentValues) {
      return this.currentValues[objectId];
    }
  }

  getRealDataCycle() {
    if (this.dataModel && this.dataModel.length > 0) {
      this.dataModel.forEach(item => {
        this.store.dispatch(new GetCurrentValuesAction(item.id));
      });
    }
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

  onFeatureClick(event) {
    console.log('On Feature Click!', event);
  }

}
