import { IMarker } from '../components/models/marker.interface';
import { IGeoPoint } from '../components/models/geo-point.interface';
import { PollutionModel } from '../components/models/pollution.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface IInitialized {
    dataReady: boolean;
    objectsReady: boolean;
}

@Injectable()
export class PollutionService {
    minsk: IGeoPoint = {
        latitude: 53.893009,
        longtitude: 27.567444
    };

    public isInitialized: BehaviorSubject<IInitialized> = new BehaviorSubject({ dataReady: false, objectsReady: false });
    dataReady = false;
    objectsReady = false;
    pollutions: any;
    objects: any;

    constructor(private httpClient: HttpClient) {
        this.init();
    }

    init() {
        this.httpClient
            .get('/assets/data/pollutions.json', {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .subscribe(res => {
                this.pollutions = res;
                this.dataReady = true;
                this.isInitialized.next({ dataReady: true, objectsReady: this.objectsReady });
            });
        this.httpClient
            .get('/assets/data/geo-objects.json', {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .subscribe(res => {
                this.objects = res;
                this.objectsReady = true;
                this.isInitialized.next({ dataReady: this.dataReady, objectsReady: true });
            });
    }

    getMapCenter(): IGeoPoint {
        return {
            latitude: this.minsk.latitude,
            longtitude: this.minsk.longtitude
        };
    }
    getPoints(): IMarker[] {
        const markers = [];
        const o = this.objects;
        Object.keys(o).forEach(key => {
            const m: IMarker = {
                title: o[key].title,
                description: o[key].description,
                geo: {
                    longtitude: o[key].longtitude,
                    latitude: o[key].latitude
                },
                pollutions: this.getSamplePollutions(),
            };
            markers.push(m);
        });
        return markers;
    }

    getSamplePollutions(): PollutionModel[] {
        const result: PollutionModel[] = new Array<PollutionModel>();
        this.pollutions.params.forEach(p => {
            result.push(new PollutionModel(p.id, Math.floor(Math.random() * 1000) / 100, 'г/с', undefined, p.name));
        });

        return result;
    }

    getFeatureValue(features: any[]): { name: string, desc: string,  value: PollutionModel[] } {
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
