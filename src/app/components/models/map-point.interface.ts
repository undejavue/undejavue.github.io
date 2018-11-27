import { IGeoPoint } from './geo-point.interface';

export interface IMapPoint {
    geo: IGeoPoint;
    title: string;
    description?: string;
}
