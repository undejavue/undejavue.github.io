import { Injectable } from '@angular/core';
import { PollutionType } from '../components/models/pollution.enum';
import { IPollutionModel } from '../components/models/pollution.interface';
import { IDataModelItem } from '../components/models/data-model-item.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CurrentValuesDto } from '../api/contracts/current-values/current-values.dto';

export interface IInitialized {
    paramsReady: boolean;
    objectsReady: boolean;
    geoReady: boolean;
    countryReady: boolean;
}

export interface IMapHelperData {
    parametres?: any;
    objects?: any;
    geo?: any;
}

@Injectable()
export class MapHelperService {
    private processReady: IInitialized = {
        paramsReady: false,
        objectsReady: false,
        geoReady: false,
        countryReady: false
    };
    private initProcess: BehaviorSubject<IInitialized> = new BehaviorSubject(this.processReady);
    private data: IMapHelperData;
    private defaults: any;
    private country: any;

    public isInitialized: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private httpClient: HttpClient) {

    }

    init() {
        this.data = {};

        const headers = {'content-type': 'application/json'};
        this.httpClient.get('assets/data/geo-objects.json', { headers })
        .subscribe(res => {
                this.data.geo = res;
                this.processReady = { ...this.processReady, geoReady: true };
                this.initProcess.next(this.processReady);
            });
        this.httpClient.get('assets/data/parametres.json', { headers })
            .subscribe(res => {
                this.data.parametres = res['params'];
                this.defaults = res['defaults'];
                this.processReady = { ...this.processReady, paramsReady: true };
                this.initProcess.next(this.processReady);
            });
        this.httpClient.get('assets/data/info-objects.json', { headers })
            .subscribe(res => {
                this.data.objects = res;
                this.processReady = { ...this.processReady, objectsReady: true };
                this.initProcess.next(this.processReady);
            });
        this.httpClient.get('assets/data/belarus.geo.json', { headers })
            .subscribe(res => {
                this.country = res;
                this.processReady = { ...this.processReady, countryReady: true };
                this.initProcess.next(this.processReady);
            });

        this.initProcess.pipe().subscribe(p => {
            const ready = p.objectsReady && p.paramsReady && p.countryReady && p.geoReady;
            if (!ready) {
                this.isInitialized.next(false);
            } else {
                this.isInitialized.next(true);
            }
        });
    }

    getDefaults() {
        if (this.processReady.paramsReady) {
            return this.defaults;
        }
    }

    getParametres() {
        if (this.processReady.paramsReady) {
            return this.data.parametres;
        }
    }

    getContryCoordinates() {
        return this.country.features[0].geometry.coordinates;
    }

    getDataModel(): Observable<IDataModelItem[]> {
        const result = new Array<IDataModelItem>();
        this.data.objects.map(obj => {
            // const values = this.data.pollutions.values.find(p => p.id === obj.id);
            const geo = this.data.geo.find(g => g.id === obj.id);
            const item: IDataModelItem = {
                id: obj.id,
                title: obj.title,
                latitude: geo.latitude,
                longtitude: geo.longtitude,
                address: obj.address,
                // datetime: this.data.pollutions.datetime,
                information: {
                    imgUrl: obj.imgUrl,
                    description: obj.description,
                    function: obj.function,
                    contentHeader: obj.contentHeader,
                    content: obj.content
                },
                // emissions: values ? this.getPollution(values.emissions, PollutionType.Emission) : [],
                // concentrations: values ? this.getPollution(values.concentrations, PollutionType.Concentration) : []
            };
            result.push(item);
        });
        return of(result);
    }

    getPopupOptions() {
        return {
            dimEm: this.getDimension(PollutionType.Emission),
            dimConc: this.getDimension(PollutionType.Concentration)
        };
    }

    getDimension(type: PollutionType) {
        switch (type) {
            case PollutionType.Concentration: return this.defaults.conc;
            case PollutionType.Emission: return this.defaults.emission;
        }
    }

/*     getFeatureValue(id: string, item: IDataModelItem): IDataModelItem {
        this
    } */

    calcAggregatedValue(features: any[]) {
        /* let acc = 0;
        features.forEach(f => {
            const p = f.get('value');
            acc = parseInt(p[0].value, 10) + acc;
        });
        const avg = acc / features.length;
        return avg.toString(); */
        return features ? features.length.toString()
            : '';
    }
}
