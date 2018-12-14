import { IGeoPoint } from './geo-point.interface';

export interface IMapOptions {
    center: IGeoPoint;
    bounds: number[];
    zoom: number;
    country: {
        withBorder: boolean,
        name: string,
        geoJson: string
    };
}
