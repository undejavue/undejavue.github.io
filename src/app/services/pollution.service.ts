import { IMarker } from '../components/models/marker.interface';
import { IGeoPoint } from '../components/models/geo-point.interface';
import { IPollutionModel } from '../components/models/pollution.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { PollutionType } from '../components/models/pollution.enum';
import { IDataModelItem } from '../components/models/data-model-item.interface';
import { ConfigService } from './config.service';
import { WebApiService } from './webapi.service';
import { CurrentValuesDto } from '../api/contracts/current-values/current-values.dto';
import { ConcentrationsDto } from '../api/contracts/current-values/concentrations.dto';
import { map } from 'rxjs/operators';
import { isUndefined, isNull } from 'util';



@Injectable()
export class PollutionService {
    parametres;
    defaults;
    constructor(
        private config: ConfigService,
        private apiService: WebApiService) {
    }

    init(params, defaults) {
        this.parametres = params;
        this.defaults = defaults;
    }

    getCurrentValues(id): Observable<CurrentValuesDto> {
        if (this.apiService.webApis[id]) {
            return this.apiService.getCurrentValues(id);
        } else {
            return this.getDummyValues();
        }
    }

    getCurrentDataItemModel(id, model: IDataModelItem): Observable<IDataModelItem> {
        return this.getCurrentValues(id).pipe(map(dto => this.mapValuesDtoToModel(dto, model)));
    }

    getDummyValues(): Observable<CurrentValuesDto> {
        return of(new CurrentValuesDto());
    }

    getReportData(id) {
        return of([{ key: 'fake', value: 'fake' }]);
    }

    getPollution(source: {}, type: PollutionType) {
        const dest = new Array<IPollutionModel>();

        Object.keys(source).forEach(key => {
            const param = this.parametres
                .find(p => (p.id as string).toLowerCase() === key.toLowerCase());
            if (param && this.isValid(source[key])) {
                const pollution: IPollutionModel = {
                    name: key.toUpperCase(),
                    value: source[key],
                    dim: this.getDimension(type),
                    desc: param ? param.name : ''
                };
                dest.push(pollution);
            }
        });

        return dest;
    }

    isValid(value) {
        return !isNull(value) && !isUndefined(value);
    }

    getDimension(type: PollutionType) {
        switch (type) {
            case PollutionType.Concentration: return this.defaults.conc;
            case PollutionType.Emission: return this.defaults.emission;
        }
    }

    getReportInfo(id: string): IDataModelItem {
        /* if (id && this.dataModel) {
            const result = this.dataModel.find(m => m.id === id);
            return result;
        } */
        return null;
    }

    // Mapping section
    mapValuesDtoToModel(dto: CurrentValuesDto, model: IDataModelItem): IDataModelItem {
        model.emissions = this.getPollution(dto.concentration, PollutionType.Concentration);
        model.concentrations = this.getPollution(dto.emission, PollutionType.Emission);
        model.emissions = model.emissions.concat(this.getPollution(dto.gas, PollutionType.Emission));

        const arr = (dto.updatedOn as string).split('T');
        if (arr.length > 1) {
            const date = arr[0];
            const time = arr[1].split('.')[0];
            model.datetime = `${date} ${time}`;
        } else {
            model.datetime = dto.updatedOn;
        }

        return model;
    }
}
