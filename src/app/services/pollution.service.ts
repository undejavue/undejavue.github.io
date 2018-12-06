import { IMarker } from '../components/models/marker.interface';
import { IGeoPoint } from '../components/models/geo-point.interface';
import { IPollutionModel } from '../components/models/pollution.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { PollutionType } from '../components/models/pollution.enum';

export interface IInitialized {
    paramsReady: boolean;
    objectsReady: boolean;
    pollutionsReady: boolean;
}

export interface IPolutionsData {
    parametres?: any;
    objects?: any;
    pollutions?: any;
}

@Injectable()
export class PollutionService {
    minsk: IGeoPoint = {
        latitude: 53.893009,
        longtitude: 27.567444
    };

    public isInitialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
    processReady: IInitialized = {
        paramsReady: false,
        objectsReady: false,
        pollutionsReady: false
    };
    private initProcess: BehaviorSubject<IInitialized> = new BehaviorSubject(this.processReady);

    data: IPolutionsData;
    dataModel: any[];
    defaults: any;

    constructor(private httpClient: HttpClient) {
        this.init();
    }

    init() {
        this.data = {};
        this.httpClient
            .get('assets/data/parametres.json', {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .subscribe(res => {
                this.data.parametres = res;
                this.defaults = res['defaults'];
                this.processReady = { ...this.processReady, paramsReady: true };
                this.initProcess.next(this.processReady);
            });
        this.httpClient
            .get('assets/data/geo-objects.json', {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .subscribe(res => {
                this.data.objects = res;
                this.processReady = { ...this.processReady, objectsReady: true };
                this.initProcess.next(this.processReady);
            });
        this.httpClient
            .get('assets/data/pollutions.json', {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .subscribe(res => {
                this.data.pollutions = res;
                this.processReady = { ...this.processReady, pollutionsReady: true };
                this.initProcess.next(this.processReady);
            });
        this.initProcess.pipe().subscribe(p => {
            const ready = p.objectsReady && p.paramsReady && p.pollutionsReady;
            if (!ready) {
                this.isInitialized.next(false);
            } else {
                this.createDataModel();
                this.isInitialized.next(true);
            }
        });

    }

    getMapCenter(): IGeoPoint {
        return {
            latitude: this.minsk.latitude,
            longtitude: this.minsk.longtitude
        };
    }

    createDataModel() {
        const result = [];
        this.data.objects.map(obj => {
            const item = {
                ...obj,
                datetime: this.data.pollutions.datetime
            };
            const values = this.data.pollutions.values.find(p => p.id === obj.id);
            if (values) {
                item.emissions = values.emissions;
                item.concentrations = values.concentrations;
            }
            result.push(item);
        });
        this.dataModel = result;
    }

    getPoints(): IMarker[] {
        const markers = [];
        if (this.dataModel) {
            this.dataModel.map(obj => {
                const m: IMarker = {
                    id: obj.id,
                    title: obj.title,
                    address: obj.address,
                    geo: {
                        longtitude: obj.longtitude,
                        latitude: obj.latitude
                    },
                    emissions: this.getPollution(obj.emissions, PollutionType.Emission),
                    concentrations: this.getPollution(obj.concentrations, PollutionType.Concentration)
                };
                markers.push(m);
            });
            return markers;
        }
    }


    getDimension(type: PollutionType) {
        switch (type) {
            case PollutionType.Concentration: return this.defaults.conc;
            case PollutionType.Emission: return this.defaults.emission;
        }
    }

    getPollution(source, type: PollutionType) {
        const result: IPollutionModel[] = new Array<IPollutionModel>();
        Object.keys(source).forEach(key => {
            const pollution: IPollutionModel = {
                name: key,
                value: source[key],
                dim: this.getDimension(type)
            };
            result.push(pollution);
        });

        return result;
    }

    getFeatureValue(features: any[]): { name: string, desc: string, value: IPollutionModel[] } {
        const f = features[0].get('features')[0];
        const value = f.get('value');
        const name = f.get('name');
        const desc = f.get('description');

        return { name, desc, value };
    }

    calcAggregatedValue(features: any[]) {
        let acc = 0;
        features.forEach(f => {
            const p = f.get('value');
            acc = parseInt(p[0].value, 10) + acc;
        });
        const avg = acc / features.length;
        return avg.toString();

    }
}
