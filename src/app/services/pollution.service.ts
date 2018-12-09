import { IMarker } from '../components/models/marker.interface';
import { IGeoPoint } from '../components/models/geo-point.interface';
import { IPollutionModel } from '../components/models/pollution.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { PollutionType } from '../components/models/pollution.enum';
import { IDataModelItem } from '../components/models/data-model-item.interface';
import { ConfigService } from './config.service';

export interface IInitialized {
    paramsReady: boolean;
    objectsReady: boolean;
    pollutionsReady: boolean;
    geoReady: boolean;
    countryReady: boolean;
}

export interface IPolutionsData {
    parametres?: any;
    objects?: any;
    pollutions?: any;
    geo?: any;
}

@Injectable()
export class PollutionService {
    public isInitialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
    processReady: IInitialized = {
        paramsReady: false,
        objectsReady: false,
        pollutionsReady: false,
        geoReady: false,
        countryReady: false
    };
    private initProcess: BehaviorSubject<IInitialized> = new BehaviorSubject(this.processReady);

    data: IPolutionsData;
    dataModel: any[];
    defaults: any;
    markers: IMarker[];
    country: any;

    constructor(private httpClient: HttpClient, private config: ConfigService) {
        this.init();
    }

    init() {
        this.data = {};
        /*         const geo$ = this.httpClient
                .get('assets/data/geo-objects.json', {
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const info$ = this.httpClient
                .get('assets/data/info-objects.json', {
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const geoInfo$ = forkJoin(geo$, info$).pipe().subscribe(r => {
                }); */

        this.httpClient.get('assets/data/geo-objects.json', {
            headers: {
                'content-type': 'application/json'
            }
        })
            .subscribe(res => {
                this.data.geo = res;
                this.processReady = { ...this.processReady, geoReady: true };
                this.initProcess.next(this.processReady);
            });
        this.httpClient
            .get('assets/data/parametres.json', {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .subscribe(res => {
                this.data.parametres = res['params'];
                this.defaults = res['defaults'];
                this.processReady = { ...this.processReady, paramsReady: true };
                this.initProcess.next(this.processReady);
            });
        this.httpClient
            .get('assets/data/info-objects.json', {
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
        this.httpClient
            .get('assets/data/belarus.geo.json', {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .subscribe(res => {
                this.country = res;
                this.processReady = { ...this.processReady, countryReady: true };
                this.initProcess.next(this.processReady);
            });

        this.initProcess.pipe().subscribe(p => {
            const ready = p.objectsReady && p.paramsReady && p.pollutionsReady && p.countryReady && p.geoReady;
            if (!ready) {
                this.isInitialized.next(false);
            } else {
                this.createDataModel();
                this.isInitialized.next(true);
            }
        });
    }

    getContryCoordinates() {
        return this.country.features[0].geometry.coordinates;
    }

    createDataModel() {
        const result = [];
        this.data.objects.map(obj => {
            const values = this.data.pollutions.values.find(p => p.id === obj.id);
            const geo = this.data.geo.find(g => g.id === obj.id);
            const item: IDataModelItem = {
                id: obj.id,
                title: obj.title,
                latitude: geo.latitude,
                longtitude: geo.longtitude,
                address: obj.address,
                datetime: this.data.pollutions.datetime,
                information: {
                    imgUrl: obj.imgUrl,
                    description: obj.description,
                    function: obj.function,
                    contentHeader: obj.contentHeader,
                    content: obj.content
                },
                emissions: this.getPollution(values.emissions, PollutionType.Emission),
                concentrations: this.getPollution(values.concentrations, PollutionType.Concentration)
            };
            result.push(item);
        });
        this.dataModel = result;
    }

    getPoints(): IMarker[] {
        this.markers = new Array<IMarker>();
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
                this.markers.push(m);
            });
            return this.markers;
        }
    }


    getDimension(type: PollutionType) {
        switch (type) {
            case PollutionType.Concentration: return this.defaults.conc;
            case PollutionType.Emission: return this.defaults.emission;
        }
    }

    getPopupOptions() {
        return {
            dimEm: this.getDimension(PollutionType.Emission),
            dimConc: this.getDimension(PollutionType.Concentration)
        };
    }

    getPollution(source, type: PollutionType) {
        const result: IPollutionModel[] = new Array<IPollutionModel>();
        Object.keys(source).forEach(key => {
            const param = this.data.parametres.find(p => p.id === key);
            const pollution: IPollutionModel = {
                name: key,
                value: source[key],
                dim: this.getDimension(type),
                desc: param ? param.name : ''
            };
            result.push(pollution);
        });

        return result;
    }

    getFeatureValue(features: any[]): IDataModelItem {
        const f = features[0].get('features')[0];
        const id = f.get('id');

        if (id && this.dataModel) {
            const result = this.dataModel.find(m => m.id === id);
            return result;
        }

        return;
    }

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
