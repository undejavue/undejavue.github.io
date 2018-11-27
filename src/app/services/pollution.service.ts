import { IMarker } from '../components/models/marker.interface';
import { IGeoPoint } from '../components/models/geo-point.interface';
import { PollutionModel } from '../components/models/pollution.model';
import { Injectable } from '@angular/core';

@Injectable()
export class PollutionService {
    // Belarus cities
    gomel: IGeoPoint = {
        latitude: 52.4345,
        longtitude: 30.9754
    };
    // Minsk
    minsk: IGeoPoint = {
        latitude: 53.893009,
        longtitude: 27.567444
    };
    // Bobryisk
    bobryisk: IGeoPoint = {
        longtitude: 29.2213753,
        latitude: 53.1446069
    };
    // Zhlobin
    zhlobin: IGeoPoint = {
        latitude: 52.8926 ,
        longtitude: 30.024
    };
    // Mozyr
    mozyr: IGeoPoint = {
        latitude: 52.0495,
        longtitude: 29.2456
    };

    constructor() { }

    getMapCenter(): IGeoPoint {
        return {
            latitude: this.minsk.latitude,
            longtitude: this.minsk.longtitude
        };
    }
    getPoints(): IMarker[] {
        const markers = [
            {
                title: 'Gomel',
                description: 'Description 1',
                geo: {
                    longtitude: this.gomel.longtitude,
                    latitude: this.gomel.latitude
                },
                pollutions: this.getSamplePollutions(),
            },
            {
                title: 'Minsk',
                description: 'Description 2',
                geo: {
                    longtitude: this.minsk.longtitude,
                    latitude: this.minsk.latitude
                },
                pollutions: this.getSamplePollutions(),
            },
            {
                title: 'Bobryisk',
                description: 'Description 3',
                geo: {
                    longtitude: this.bobryisk.longtitude,
                    latitude: this.bobryisk.latitude
                },
                pollutions: this.getSamplePollutions(),
            },
            {
                title: 'Mozyr',
                description: 'Description 4',
                geo: {
                    longtitude: this.mozyr.longtitude,
                    latitude: this.mozyr.latitude
                },
                pollutions: this.getSamplePollutions(),
            },
            {
                title: 'Zhlobin',
                description: 'Description 5',
                geo: {
                    longtitude: this.zhlobin.longtitude,
                    latitude: this.zhlobin.latitude
                },
                pollutions: this.getSamplePollutions(),
            },
        ];

        return markers;
    }

    getSamplePollutions(): PollutionModel[] {
        const result: PollutionModel[] = new Array<PollutionModel>();
        for (let i = 0; i < 2; i++) {
            result.push(new PollutionModel('Param ', 42));
        }
        return result;
    }
}
